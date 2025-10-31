import { z } from 'zod'

export const productSchema = z.object({
  name: z
    .string()
    .min(3, 'Product name must be at least 3 characters')
    .max(100, 'Product name must be at most 100 characters'),
  tagline: z
    .string()
    .min(10, 'Tagline must be at least 10 characters')
    .max(200, 'Tagline must be at most 200 characters'),
  website_url: z.url('Please enter a valid URL'),
  repo_url: z.url('Please enter a valid URL').optional(),
  is_open_source: z.boolean(),
  description: z
    .string()
    .min(50, 'Description must be at least 50 characters')
    .max(1000, 'Description must be at most 1000 characters'),
  tags: z
    .array(z.string().min(1))
    .min(1, 'Add at least 1 tag')
    .max(3, 'Maximum 3 tags allowed'),
  logo_url: z.url('Please enter a valid URL').optional(),
  demo_url: z.url('Please enter a valid URL').optional(),
  pricing_model: z.enum(['free', 'freemium', 'premium']),
  promo_code: z.string().optional(),
  twitter_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  linkedin_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  product_hunt_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  platforms: z
    .array(z.enum(['web', 'ios', 'android', 'desktop', 'api', 'browser_extension', 'other']))
    .min(1, 'Select at least one platform'),
}).refine((data) => {
  // If open source, repo_url is required
  if (data.is_open_source && !data.repo_url) {
    return false
  }
  return true
}, {
  message: 'Repository URL is required for open source projects',
  path: ['repo_url'],
})

export type ProductFormData = z.infer<typeof productSchema>

export const commentSchema = z.object({
  content: z.string()
    .min(1, 'Comment cannot be empty')
    .max(5000, 'Comment is too long (max 5000 characters)'),
  product_id: z.uuid(),
  parent_id: z.uuid().optional().nullable(),
});

export type CommentFormData = z.infer<typeof commentSchema>;

