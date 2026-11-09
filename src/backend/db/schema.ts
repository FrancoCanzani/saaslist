import {
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core"

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .default(false)
    .notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
})

export const session = sqliteTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    token: text("token").notNull().unique(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
)

export const account = sqliteTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: integer("access_token_expires_at", {
      mode: "timestamp_ms",
    }),
    refreshTokenExpiresAt: integer("refresh_token_expires_at", {
      mode: "timestamp_ms",
    }),
    scope: text("scope"),
    password: text("password"),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
)

export const verification = sqliteTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
)

export const productStatuses = ["pending", "approved", "rejected"] as const
export type ProductStatus = (typeof productStatuses)[number]

export const pricingModels = ["free", "freemium", "premium"] as const
export type PricingModel = (typeof pricingModels)[number]

export const platforms = [
  "web",
  "ios",
  "android",
  "desktop",
  "api",
  "browser_extension",
  "other",
] as const
export type Platform = (typeof platforms)[number]

export const product = sqliteTable(
  "product",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    tagline: text("tagline").notNull(),
    description: text("description").notNull(),
    audience: text("audience").notNull(),
    websiteUrl: text("website_url").notNull(),
    category: text("category").notNull(),
    pricingModel: text("pricing_model").$type<PricingModel>().notNull(),
    platforms: text("platforms", { mode: "json" }).$type<Platform[]>().notNull(),
    tags: text("tags", { mode: "json" }).$type<string[]>().notNull(),
    status: text("status").$type<ProductStatus>().notNull().default("pending"),
    reviewNote: text("review_note"),
    funding: text("funding").notNull().default("bootstrapped"),
    sponsoredUntil: integer("sponsored_until", { mode: "timestamp_ms" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [
    index("product_status_idx").on(table.status),
    index("product_userId_idx").on(table.userId),
    index("product_category_idx").on(table.category),
  ],
)

export const prospectStatuses = [
  "new",
  "ready",
  "emailed",
  "replied",
  "listed",
  "skipped",
] as const
export type ProspectStatus = (typeof prospectStatuses)[number]

export const prospect = sqliteTable(
  "prospect",
  {
    id: text("id").primaryKey(),
    source: text("source").notNull(),
    sourceUrl: text("source_url").notNull(),
    productName: text("product_name").notNull(),
    websiteUrl: text("website_url").notNull(),
    contactEmail: text("contact_email").notNull(),
    tagline: text("tagline"),
    status: text("status").$type<ProspectStatus>().notNull().default("new"),
    note: text("note"),
    emailedAt: integer("emailed_at", { mode: "timestamp_ms" }),
    createdByUserId: text("created_by_user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [
    uniqueIndex("prospect_source_url_idx").on(table.sourceUrl),
    index("prospect_status_idx").on(table.status),
  ],
)
