import { z } from "zod";

const zEmptyStrToUndefined = z.preprocess(
  (arg) => {
    if (typeof arg === "string" && arg === "") {
      return undefined;
    }
    return arg;
  },
  z.url("Please enter a valid URL").optional()
);

const baseProductSchema = z.object({
  name: z
    .string()
    .min(3, "Product name must be at least 3 characters")
    .max(100, "Product name must be at most 100 characters"),
  tagline: z
    .string()
    .min(10, "Tagline must be at least 10 characters")
    .max(200, "Tagline must be at most 200 characters"),
  website_url: z.url("Please enter a valid URL"),
  repo_url: zEmptyStrToUndefined,
  is_open_source: z.boolean(),
  description: z
    .string()
    .min(50, "Description must be at least 50 characters")
    .max(1000, "Description must be at most 1000 characters"),
  tags: z
    .array(z.string().min(1))
    .min(1, "Add at least 1 tag")
    .max(3, "Maximum 3 tags allowed"),
  logo_url: zEmptyStrToUndefined,
  demo_url: zEmptyStrToUndefined,
  pricing_model: z.enum(["free", "freemium", "premium"]),
  twitter_url: zEmptyStrToUndefined,
  linkedin_url: zEmptyStrToUndefined,
  product_hunt_url: zEmptyStrToUndefined,
  platforms: z
    .array(
      z.enum([
        "web",
        "ios",
        "android",
        "desktop",
        "api",
        "browser_extension",
        "other",
      ]),
    )
    .min(1, "Select at least one platform"),
});

const openSourceRepoRefine = (data: {
  is_open_source?: boolean;
  repo_url?: string | undefined;
}) => {
  if (data.is_open_source === true && !data.repo_url) {
    return false;
  }
  return true;
};

export const productSchema = baseProductSchema.refine(
  openSourceRepoRefine,
  {
    message: "Repository URL is required for open source projects",
    path: ["repo_url"],
  },
);

export type ProductFormData = z.infer<typeof productSchema>;

export const commentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(5000, "Comment is too long (max 5000 characters)"),
  product_id: z.uuid(),
  parent_id: z.uuid().optional().nullable(),
});

export type CommentFormData = z.infer<typeof commentSchema>;

export const reviewSchema = z.object({
  rating: z
    .number()
    .int()
    .min(1, "Rating must be at least 1 star")
    .max(5, "Rating must be at most 5 stars"),
  title: z.string().max(100, "Title must be at most 100 characters").optional(),
  content: z
    .string()
    .min(50, "Review must be at least 50 characters")
    .max(2000, "Review is too long (max 2000 characters)"),
  product_id: z.uuid(),
});

export type ReviewFormDataSchema = z.infer<typeof reviewSchema>;

export const updateSchema = z.object({
  title: z
    .string()
    .min(1, "Title cannot be empty")
    .max(200, "Title must be at most 200 characters"),
  content: z
    .string()
    .min(1, "Content cannot be empty")
    .max(10000, "Content is too long (max 10000 characters)"),
  product_id: z.uuid(),
});

export type UpdateFormData = z.infer<typeof updateSchema>;

export const productUpdateSchema = baseProductSchema
  .partial()
  .extend({
    images: z.array(z.string().url()).optional(),
  })
  .refine(openSourceRepoRefine, {
    message: "Repository URL is required for open source projects",
    path: ["repo_url"],
  });

export type ProductUpdateData = z.infer<typeof productUpdateSchema>;
