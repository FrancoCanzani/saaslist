import { eq } from "drizzle-orm"
import { Hono } from "hono"

import { product, user } from "../../../db/schema"
import { createDb } from "../../../lib/db"
import type { AppEnv } from "../../../types"
import { likedIds, viewerId } from "./lib/likes"
import { serializeProduct } from "./lib/serialize"

export const getProduct = new Hono<AppEnv>().get("/:slug", async (c) => {
  const slug = c.req.param("slug")
  if (slug === "mine") {
    return c.json({ error: "not_found" as const }, 404)
  }

  const db = createDb(c.env)
  const viewer = await viewerId(c)
  const liked = await likedIds(db, viewer)
  const row = await db
    .select({
      product,
      founderName: user.name,
    })
    .from(product)
    .innerJoin(user, eq(product.userId, user.id))
    .where(eq(product.slug, slug))
    .get()

  if (!row || row.product.status !== "approved") {
    return c.json({ error: "not_found" as const }, 404)
  }

  return c.json({
    product: serializeProduct(
      row.product,
      row.founderName,
      liked.has(row.product.id),
    ),
  })
})
