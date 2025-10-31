import { z } from 'zod'

export const newsletterSubscriptionSchema = z.object({
  email: z.email('Please enter a valid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
})

export type NewsletterSubscriptionInput = z.infer<typeof newsletterSubscriptionSchema>

