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
