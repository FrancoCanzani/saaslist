export interface Profile {
  id: string
  name: string | null
  email: string | null
  avatar_url: string | null
  twitter: string | null
  website: string | null
  is_featured: boolean | null
  featured_until: string | null
  created_at: string
  updated_at: string
}
