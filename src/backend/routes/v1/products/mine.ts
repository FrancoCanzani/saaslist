import { desc, eq } from "drizzle-orm"
import { Hono } from "hono"

import { product, user } from "../../../db/schema"
import { createDb } from "../../../lib/db"
import { requireSession } from "../../../middleware/session"
import type { AppEnv } from "../../../types"
import { serializeProduct } from "./lib/serialize"

export const mine = new Hono<AppEnv>().get("/mine", requireSession, async (c) => {
  const db = createDb(c.env)
  const rows = await db
    .select({
      product,
      founderName: user.name,
    })
    .from(product)
    .innerJoin(user, eq(product.userId, user.id))
    .where(eq(product.userId, c.get("user").id))
    .orderBy(desc(product.createdAt))

  return c.json({
    products: rows.map((row) => serializeProduct(row.product, row.founderName)),
  })
})
