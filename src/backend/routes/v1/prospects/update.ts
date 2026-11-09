import { zValidator } from "@hono/zod-validator"
import { and, eq, gte, sql } from "drizzle-orm"
import { Hono } from "hono"

import { prospect, type ProspectStatus } from "../../../db/schema"
import { createDb } from "../../../lib/db"
import { dailySendCap } from "../../../lib/editor"
import { sendAppEmail } from "../../../lib/mail"
import { requireEditor } from "../../../middleware/session"
import type { AppEnv } from "../../../types"
import { outreachMessage } from "./lib/email"
import { prospectActionSchema } from "./lib/schema"
import { serializeProspect } from "./lib/serialize"

export const updateProspect = new Hono<AppEnv>().post(
  "/:id",
  requireEditor,
  zValidator("json", prospectActionSchema),
  async (c) => {
    const id = c.req.param("id")
    const { action } = c.req.valid("json")
    const db = createDb(c.env)
    const existing = await db
      .select()
      .from(prospect)
      .where(eq(prospect.id, id))
      .get()

    if (!existing) {
      return c.json({ error: "not_found" as const }, 404)
    }

    const now = new Date()

    if (action === "send") {
      if (existing.status !== "ready") {
        return c.json({ error: "not_ready" as const }, 409)
      }

      const start = startOfUtcDay(now)
      const sentToday = await db
        .select({ count: sql<number>`count(*)` })
        .from(prospect)
        .where(
          and(eq(prospect.status, "emailed"), gte(prospect.emailedAt, start)),
        )
        .get()

      if ((sentToday?.count ?? 0) >= dailySendCap(c.env)) {
        return c.json({ error: "daily_cap" as const }, 429)
      }

      const message = outreachMessage({
        productName: existing.productName,
        source: existing.source,
        sourceUrl: existing.sourceUrl,
        origin: c.env.BETTER_AUTH_URL,
      })

      await sendAppEmail(c.env, undefined, {
        to: existing.contactEmail,
        subject: message.subject,
        text: message.text,
        html: message.html,
        replyTo: c.env.EMAIL_REPLY_TO,
        devLine: `[outreach] ${existing.contactEmail} ${message.subject}\n${message.text}`,
      })

      await db
        .update(prospect)
        .set({ status: "emailed", emailedAt: now, updatedAt: now })
        .where(eq(prospect.id, id))
    } else {
      const status = nextStatus(action, existing.status)
      if (!status) {
        return c.json({ error: "invalid_transition" as const }, 409)
      }

      await db
        .update(prospect)
        .set({ status, updatedAt: now })
        .where(eq(prospect.id, id))
    }

    const updated = await db
      .select()
      .from(prospect)
      .where(eq(prospect.id, id))
      .get()
    if (!updated) {
      return c.json({ error: "update_failed" as const }, 500)
    }

    return c.json({ prospect: serializeProspect(updated) })
  },
)

function nextStatus(
  action: "ready" | "skip" | "replied" | "listed",
  current: ProspectStatus,
): ProspectStatus | null {
  switch (action) {
    case "ready":
      return current === "new" ? "ready" : null
    case "skip":
      return current === "new" || current === "ready" ? "skipped" : null
    case "replied":
      return current === "emailed" ? "replied" : null
    case "listed":
      return current === "emailed" || current === "replied" ? "listed" : null
    default: {
      const exhaustive: never = action
      return exhaustive
    }
  }
}

function startOfUtcDay(now: Date) {
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  )
}
