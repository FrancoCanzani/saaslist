import { eq } from "drizzle-orm"

import { categoryBySlug } from "../../../../db/categories"
import { product } from "../../../../db/schema"
import type { Database } from "../../../../lib/db"

export function slugify(name: string) {
  const base = name
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)

  return base.length > 0 ? base : "tool"
}

export async function uniqueSlug(db: Database, name: string) {
  const base = slugify(name)
  let candidate = base

  for (let attempt = 2; attempt < 50; attempt += 1) {
    const existing = await db
      .select({ id: product.id })
      .from(product)
      .where(eq(product.slug, candidate))
      .limit(1)

    if (existing.length === 0) {
      return candidate
    }

    candidate = `${base}-${attempt}`
  }

  return `${base}-${crypto.randomUUID().slice(0, 8)}`
}

export function categoryName(slug: string) {
  return categoryBySlug(slug)?.name ?? slug
}
