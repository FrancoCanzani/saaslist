import type { InferSelectModel } from "drizzle-orm"

import { product } from "../../../../db/schema"
import { categoryName } from "./slug"

export type ProductRecord = InferSelectModel<typeof product>

export type PublicProduct = {
  id: string
  slug: string
  name: string
  tagline: string
  description: string
  audience: string
  websiteUrl: string
  category: string
  categoryName: string
  pricingModel: ProductRecord["pricingModel"]
  platforms: ProductRecord["platforms"]
  tags: ProductRecord["tags"]
  status: ProductRecord["status"]
  reviewNote: string | null
  founderName: string
  sponsored: boolean
  likeCount: number
  liked: boolean
  createdAt: string
}

export function serializeProduct(
  row: ProductRecord,
  founderName: string,
  liked = false,
): PublicProduct {
  const sponsoredUntil = row.sponsoredUntil?.getTime() ?? 0

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    audience: row.audience,
    websiteUrl: row.websiteUrl,
    category: row.category,
    categoryName: categoryName(row.category),
    pricingModel: row.pricingModel,
    platforms: row.platforms,
    tags: row.tags,
    status: row.status,
    reviewNote: row.reviewNote,
    founderName,
    sponsored: sponsoredUntil > Date.now(),
    likeCount: row.likeCount,
    liked,
    createdAt: row.createdAt.toISOString(),
  }
}
