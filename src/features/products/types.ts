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
  images?: string[];
  demo_url?: string;
  pricing_model: PricingModel;
  tags: string[];
  twitter_url?: string;
  linkedin_url?: string;
  product_hunt_url?: string;
  platforms: Platform[];
  user_id: string;
  likes_count: number;
  comments_count: number;
  reviews_count: number;
  is_liked?: boolean;
  founder_name?: string;
  is_featured?: boolean;
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
  logo_file?: File | null;
  image_files?: File[];
  demo_url?: string;
  pricing_model: PricingModel;
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

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: 1 | 2 | 3 | 4 | 5;
  title: string | null;
  content: string;
  created_at: string;
  updated_at: string;
  user: {
    name: string;
    avatar_url: string | null;
  };
}

export interface ReviewFormData {
  rating: 1 | 2 | 3 | 4 | 5;
  title?: string;
  content: string;
  product_id: string;
}

export type ReviewSortOption = 'newest' | 'highest' | 'lowest';

export interface Update {
  id: string;
  product_id: string;
  user_id: string;
  title: string;
  content: string; 
  created_at: string;
  updated_at: string;
  user: {
    name: string;
    avatar_url: string | null;
  };
}
