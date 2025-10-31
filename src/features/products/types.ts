export interface ApiResponse<T> {
  data: T | null;
  success: boolean;
  error: string | null;
  details?: string;
}

export type PricingModel = "free" | "freemium" | "premium";

export type Platform =
  | "web"
  | "ios"
  | "android"
  | "desktop"
  | "api"
  | "browser_extension"
  | "other";

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  website_url: string;
  repo_url?: string;
  logo_url?: string;
  demo_url?: string;
  pricing_model: PricingModel;
  promo_code?: string;
  tags: string[];
  twitter_url?: string;
  linkedin_url?: string;
  product_hunt_url?: string;
  platforms: Platform[];
  user_id: string;
  upvotes_count: number;
  comments_count: number;
  is_upvoted?: boolean; 
  created_at: string;
  updated_at: string;
}

export interface ProductFormData {
  name: string;
  tagline: string;
  website_url: string;
  repo_url?: string;
  is_open_source: boolean;
  description: string;
  tags: string[];
  logo_url?: string;
  demo_url?: string;
  pricing_model: PricingModel;
  promo_code?: string;
  twitter_url?: string;
  linkedin_url?: string;
  product_hunt_url?: string;
  platforms: Platform[];
}

export interface Comment {
  id: string;
  product_id: string;
  user_id: string;
  parent_id: string | null;
  content: string;
  is_flagged: boolean;
  created_at: string;
  updated_at: string;
  user: {
    name: string;
    avatar_url: string | null;
  };
  replies?: Comment[];
  reply_count?: number;
}

export type SortOption = 'newest' | 'oldest' | 'most_replies';
