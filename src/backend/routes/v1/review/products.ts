import { zValidator } from "@hono/zod-validator"
import { and, desc, eq } from "drizzle-orm"
import { Hono } from "hono"
import { z } from "zod"

import { product, productStatuses, user } from "../../../db/schema"
import { createDb } from "../../../lib/db"
import { requireEditor } from "../../../middleware/session"
import type { AppEnv } from "../../../types"
import { reviewDecisionSchema } from "../products/lib/schema"
import { serializeProduct } from "../products/lib/serialize"

const reviewQuery = z.object({
  status: z.enum(productStatuses).default("pending"),
})

export const reviewProducts = new Hono<AppEnv>()
  .get("/", requireEditor, zValidator("query", reviewQuery), async (c) => {
    const { status } = c.req.valid("query")
    const db = createDb(c.env)
    const rows = await db
      .select({ product, founderName: user.name })
      .from(product)
      .innerJoin(user, eq(product.userId, user.id))
      .where(eq(product.status, status))
      .orderBy(desc(product.createdAt))

    return c.json({
      products: rows.map((row) => serializeProduct(row.product, row.founderName)),
    })
  })
  .post(
    "/:id",
    requireEditor,
    zValidator("json", reviewDecisionSchema),
    async (c) => {
      const id = c.req.param("id")
      const body = c.req.valid("json")
      const db = createDb(c.env)
      const existing = await db
        .select({ product, founderName: user.name })
        .from(product)
        .innerJoin(user, eq(product.userId, user.id))
        .where(and(eq(product.id, id), eq(product.status, "pending")))
        .get()

      if (!existing) {
        return c.json({ error: "not_found" as const }, 404)
      }

      const status = decisionStatus(body.decision)
      await db
        .update(product)
        .set({
          status,
          reviewNote: body.note ?? null,
          updatedAt: new Date(),
        })
        .where(eq(product.id, id))

      const updated = await db.select().from(product).where(eq(product.id, id)).get()
      if (!updated) {
        return c.json({ error: "update_failed" as const }, 500)
      }

      return c.json({
        product: serializeProduct(updated, existing.founderName),
      })
    },
  )

function decisionStatus(decision: "approve" | "reject") {
  switch (decision) {
    case "approve":
      return "approved" as const
    case "reject":
      return "rejected" as const
    default: {
      const exhaustive: never = decision
      return exhaustive
    }
  }
}
