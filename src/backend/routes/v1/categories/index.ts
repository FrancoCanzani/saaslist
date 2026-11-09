import { eq } from "drizzle-orm"
import { Hono } from "hono"

import { categories } from "../../../db/categories"
import { product } from "../../../db/schema"
import { createDb } from "../../../lib/db"
import type { AppEnv } from "../../../types"

export const categoryRoutes = new Hono<AppEnv>().get("/", async (c) => {
  const db = createDb(c.env)
  const approved = await db
    .select({ category: product.category })
    .from(product)
    .where(eq(product.status, "approved"))

  const counts = new Map<string, number>()
  for (const row of approved) {
    counts.set(row.category, (counts.get(row.category) ?? 0) + 1)
  }

  return c.json({
    categories: categories.map((category) => ({
      ...category,
      count: counts.get(category.slug) ?? 0,
    })),
  })
})
