import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import { FeedContent } from "./feed-content";
import { FeedContentSkeleton } from "./feed-content-skeleton";

interface FeedSectionProps {
  productId: string;
  currentUserId?: string;
  isOwner: boolean;
}

export async function FeedSection({
  productId,
  currentUserId,
  isOwner,
}: FeedSectionProps) {
  const supabase = await createClient();

  const [commentsResult, reviewsResult, updatesResult] = await Promise.all([
    supabase
      .from("comments")
      .select(
        `
        *,
        user:profiles!comments_user_id_fkey(name, avatar_url)
      `,
      )
      .eq("product_id", productId)
      .order("created_at", { ascending: false }),
    supabase
      .from("reviews")
      .select(
        `
        *,
        user:profiles!reviews_user_id_fkey(name, avatar_url)
      `,
      )
      .eq("product_id", productId)
      .order("created_at", { ascending: false }),
    supabase
      .from("product_updates")
      .select(
        `
        *,
        user:profiles!product_updates_user_id_fkey(name, avatar_url)
      `,
      )
      .eq("product_id", productId)
      .order("created_at", { ascending: false }),
  ]);

  const comments = commentsResult.data || [];
  const reviews = reviewsResult.data || [];
  const updates = updatesResult.data || [];

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

  return (
    <Suspense fallback={<FeedContentSkeleton />}>
      <FeedContent
        productId={productId}
        comments={comments}
        reviews={reviews}
        updates={updates}
        currentUserId={currentUserId}
        isOwner={isOwner}
        hasUserReviewed={hasUserReviewed}
      />
    </Suspense>
  );
}
