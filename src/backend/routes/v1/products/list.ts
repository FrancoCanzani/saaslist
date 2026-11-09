import { zValidator } from "@hono/zod-validator"
import { and, desc, eq } from "drizzle-orm"
import { Hono } from "hono"

import { product, user } from "../../../db/schema"
import { createDb } from "../../../lib/db"
import type { AppEnv } from "../../../types"
import { listProductsQuery } from "./lib/schema"
import { serializeProduct } from "./lib/serialize"

export const listProducts = new Hono<AppEnv>().get(
  "/",
  zValidator("query", listProductsQuery),
  async (c) => {
    const { category } = c.req.valid("query")
    const db = createDb(c.env)
    const filters = [eq(product.status, "approved")]
    if (category) {
      filters.push(eq(product.category, category))
    }

    const rows = await db
      .select({
        product,
        founderName: user.name,
      })
      .from(product)
      .innerJoin(user, eq(product.userId, user.id))
      .where(and(...filters))
      .orderBy(desc(product.createdAt))

    const serialized = rows.map((row) =>
      serializeProduct(row.product, row.founderName),
    )

    return c.json({
      products: serialized.filter((item) => !item.sponsored),
      sponsored: serialized.filter((item) => item.sponsored),
    })
  },
)
