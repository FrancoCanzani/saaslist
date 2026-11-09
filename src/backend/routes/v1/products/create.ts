import { zValidator } from "@hono/zod-validator"
import { eq } from "drizzle-orm"
import { Hono } from "hono"

import { categoryBySlug } from "../../../db/categories"
import { product } from "../../../db/schema"
import { createDb } from "../../../lib/db"
import { requireSession } from "../../../middleware/session"
import type { AppEnv } from "../../../types"
import { createProductSchema } from "./lib/schema"
import { serializeProduct } from "./lib/serialize"
import { uniqueSlug } from "./lib/slug"

export const createProduct = new Hono<AppEnv>().post(
  "/",
  requireSession,
  zValidator("json", createProductSchema),
  async (c) => {
    const body = c.req.valid("json")
    const category = categoryBySlug(body.category)
    if (!category) {
      return c.json({ error: "unknown_category" as const }, 400)
    }

    const unknownTag = body.tags.find((tag) => !category.tags.includes(tag))
    if (unknownTag) {
      return c.json({ error: "unknown_tag" as const }, 400)
    }

    const db = createDb(c.env)
    const now = new Date()
    const id = crypto.randomUUID()
    const slug = await uniqueSlug(db, body.name)
    const founder = c.get("user")

    await db.insert(product).values({
      id,
      slug,
      name: body.name,
      tagline: body.tagline,
      description: body.description,
      audience: body.audience,
      websiteUrl: body.websiteUrl,
      category: category.slug,
      pricingModel: body.pricingModel,
      platforms: body.platforms,
      tags: body.tags,
      status: "pending",
      funding: "bootstrapped",
      userId: founder.id,
      createdAt: now,
      updatedAt: now,
    })

    const created = await db.select().from(product).where(eq(product.id, id)).get()
    if (!created) {
      return c.json({ error: "create_failed" as const }, 500)
    }

    return c.json({ product: serializeProduct(created, founder.name) }, 201)
  },
)
