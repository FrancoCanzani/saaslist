import type { InferSelectModel } from "drizzle-orm"

import { prospect } from "../../../../db/schema"

export type ProspectRecord = InferSelectModel<typeof prospect>

export type PublicProspect = {
  id: string
  source: string
  sourceUrl: string
  productName: string
  websiteUrl: string
  contactEmail: string
  tagline: string | null
  status: ProspectRecord["status"]
  note: string | null
  emailedAt: string | null
  createdAt: string
}

export function serializeProspect(row: ProspectRecord): PublicProspect {
  return {
    id: row.id,
    source: row.source,
    sourceUrl: row.sourceUrl,
    productName: row.productName,
    websiteUrl: row.websiteUrl,
    contactEmail: row.contactEmail,
    tagline: row.tagline,
    status: row.status,
    note: row.note,
    emailedAt: row.emailedAt ? row.emailedAt.toISOString() : null,
    createdAt: row.createdAt.toISOString(),
  }
}
