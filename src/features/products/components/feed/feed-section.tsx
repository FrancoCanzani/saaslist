import { Suspense } from "react";
import { getProductFeed } from "../../api/get-product-feed";
import { FeedContent } from "./feed-content";
import { FeedContentSkeleton } from "./feed-content-skeleton";

export async function FeedSection({
  productId,
  currentUserId,
  isOwner,
}: {
  productId: string;
  currentUserId?: string;
  isOwner: boolean;
}) {
  const { comments, reviews, updates, hasUserReviewed } = await getProductFeed(
    productId,
    currentUserId
  );

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
