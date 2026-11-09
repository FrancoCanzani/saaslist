import { and, eq, sql } from "drizzle-orm"
import { Hono } from "hono"

import { product, productLike } from "../../../db/schema"
import { createDb } from "../../../lib/db"
import { requireSession } from "../../../middleware/session"
import type { AppEnv } from "../../../types"

export const likeProduct = new Hono<AppEnv>().post(
  "/:slug/like",
  requireSession,
  async (c) => {
    const slug = c.req.param("slug")
    const db = createDb(c.env)
    const row = await db
      .select()
      .from(product)
      .where(eq(product.slug, slug))
      .get()

    if (!row || row.status !== "approved") {
      return c.json({ error: "not_found" as const }, 404)
    }

    const userId = c.get("user").id
    const existing = await db
      .select()
      .from(productLike)
      .where(and(eq(productLike.productId, row.id), eq(productLike.userId, userId)))
      .get()

    if (existing) {
      await db.delete(productLike).where(eq(productLike.id, existing.id))
      await db
        .update(product)
        .set({ likeCount: sql`max(${product.likeCount} - 1, 0)` })
        .where(eq(product.id, row.id))
    } else {
      await db.insert(productLike).values({
        id: crypto.randomUUID(),
        productId: row.id,
        userId,
        createdAt: new Date(),
      })
      await db
        .update(product)
        .set({ likeCount: sql`${product.likeCount} + 1` })
        .where(eq(product.id, row.id))
    }

    const updated = await db
      .select({ likeCount: product.likeCount })
      .from(product)
      .where(eq(product.id, row.id))
      .get()

    return c.json({
      liked: !existing,
      likeCount: updated?.likeCount ?? row.likeCount,
    })
  },
)
