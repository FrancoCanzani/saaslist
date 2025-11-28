import { createClient } from "@/lib/supabase/server";
import { cache } from "react";
import { Comment, Review, Update } from "../types";

interface FeedData {
  comments: Comment[];
  reviews: Review[];
  updates: Update[];
  hasUserReviewed: boolean;
}

export const getProductFeed = cache(
  async (productId: string, currentUserId?: string): Promise<FeedData> => {
    const supabase = await createClient();

    const [commentsResult, reviewsResult, updatesResult] = await Promise.all([
      supabase
        .from("comments")
        .select(
          `
        *,
        user:profiles!comments_user_id_fkey(name, avatar_url)
      `
        )
        .eq("product_id", productId)
        .order("created_at", { ascending: false }),
      supabase
        .from("reviews")
        .select(
          `
        *,
        user:profiles!reviews_user_id_fkey(name, avatar_url)
      `
        )
        .eq("product_id", productId)
        .order("created_at", { ascending: false }),
      supabase
        .from("product_updates")
        .select(
          `
        *,
        user:profiles!product_updates_user_id_fkey(name, avatar_url)
      `
        )
        .eq("product_id", productId)
        .order("created_at", { ascending: false }),
    ]);

    let hasUserReviewed = false;
    if (currentUserId) {
      const { data: userReview } = await supabase
        .from("reviews")
        .select("id")
        .eq("product_id", productId)
        .eq("user_id", currentUserId)
        .single();

      hasUserReviewed = !!userReview;
    }

    return {
      comments: (commentsResult.data as Comment[]) || [],
      reviews: (reviewsResult.data as Review[]) || [],
      updates: (updatesResult.data as Update[]) || [],
      hasUserReviewed,
    };
  }
);

