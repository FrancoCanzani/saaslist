import { z } from "zod"

const httpUrl = z
  .url()
  .refine(
    (value) => value.startsWith("https://") || value.startsWith("http://"),
    "Use an http or https URL",
  )

export const createProspectSchema = z.object({
  source: z.string().trim().min(2).max(40),
  sourceUrl: httpUrl,
  productName: z.string().trim().min(2).max(80),
  websiteUrl: httpUrl,
  contactEmail: z.email(),
  tagline: z.string().trim().max(140).optional(),
})

export const prospectActionSchema = z.object({
  action: z.enum(["ready", "skip", "replied", "listed", "send"]),
})
