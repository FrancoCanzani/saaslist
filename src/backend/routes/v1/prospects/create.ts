import { zValidator } from "@hono/zod-validator"
import { eq } from "drizzle-orm"
import { Hono } from "hono"

import { prospect } from "../../../db/schema"
import { createDb } from "../../../lib/db"
import { requireEditor } from "../../../middleware/session"
import type { AppEnv } from "../../../types"
import { createProspectSchema } from "./lib/schema"
import { serializeProspect } from "./lib/serialize"

export const createProspect = new Hono<AppEnv>().post(
  "/",
  requireEditor,
  zValidator("json", createProspectSchema),
  async (c) => {
    const body = c.req.valid("json")
    const db = createDb(c.env)
    const now = new Date()
    const id = crypto.randomUUID()

    try {
      await db.insert(prospect).values({
        id,
        source: body.source,
        sourceUrl: body.sourceUrl,
        productName: body.productName,
        websiteUrl: body.websiteUrl,
        contactEmail: body.contactEmail,
        tagline: body.tagline ?? null,
        status: "new",
        createdByUserId: c.get("user").id,
        createdAt: now,
        updatedAt: now,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : ""
      if (message.toLowerCase().includes("unique")) {
        return c.json({ error: "already_tracked" as const }, 409)
      }
      throw error
    }

    const created = await db
      .select()
      .from(prospect)
      .where(eq(prospect.id, id))
      .get()
    if (!created) {
      return c.json({ error: "create_failed" as const }, 500)
    }

    return c.json({ prospect: serializeProspect(created) }, 201)
  },
)
