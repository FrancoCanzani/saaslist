export interface NewsletterSubscription {
  id: string
  email: string
  name: string | null
  user_id: string | null
  is_active: boolean
  subscribed_at: string
  unsubscribed_at: string | null
  created_at: string
  updated_at: string
}

export interface NewsletterSubscriptionForm {
  email: string
  name: string
}

