export interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  action?: string;
}

export interface Category {
  name: string;
  slug: string;
  description?: string;
  tags: string[];
}

export interface ApiResponse<T> {
  data: T | null;
  success: boolean;
  error: string | null;
  details?: string;
}