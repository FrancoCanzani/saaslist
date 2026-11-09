import { z } from "zod"

import { platforms, pricingModels } from "../../../../db/schema"

const httpUrl = z
  .url()
  .refine(
    (value) => value.startsWith("https://") || value.startsWith("http://"),
    "Use an http or https URL",
  )

export const createProductSchema = z.object({
  name: z.string().trim().min(3).max(80),
  tagline: z.string().trim().min(10).max(140),
  description: z.string().trim().min(50).max(1000),
  audience: z.string().trim().min(10).max(200),
  websiteUrl: httpUrl,
  category: z.string().trim().min(1),
  pricingModel: z.enum(pricingModels),
  platforms: z.array(z.enum(platforms)).min(1).max(4),
  tags: z.array(z.string().trim().min(1)).min(1).max(3),
})

export const listProductsQuery = z.object({
  category: z.string().trim().min(1).optional(),
})

export const reviewDecisionSchema = z.object({
  decision: z.enum(["approve", "reject"]),
  note: z.string().trim().max(300).optional(),
})
