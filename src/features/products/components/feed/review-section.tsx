"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { Review } from "../../types";
import RatingOverview from "./rating-overview";
import ReviewForm from "./review-form";
import ReviewList from "./review-list";

interface ReviewSectionProps {
  productId: string;
  initialReviews: Review[];
  currentUserId?: string;
  averageRating: number;
  hasUserReviewed: boolean;
}

export default function ReviewSection({
  productId,
  initialReviews,
  currentUserId,
  averageRating,
  hasUserReviewed,
}: ReviewSectionProps) {
  const router = useRouter();

  const handleReviewSuccess = () => {
    router.refresh();
  };

  return (
    <div className="py-8 space-y-8">
      {currentUserId ? (
        hasUserReviewed ? (
          <Alert>
            <AlertDescription className="mx-auto">
              You have already reviewed this product
            </AlertDescription>
          </Alert>
        ) : (
          <div>
            <h3 className="font-medium mb-4">Leave a Review</h3>
            <ReviewForm productId={productId} onSuccess={handleReviewSuccess} />
          </div>
        )
      ) : (
        <Alert className="mx-auto">
          <AlertDescription>Please log in to leave a review</AlertDescription>
        </Alert>
      )}

      <div className="space-y-8">
        <RatingOverview
          reviews={initialReviews}
          averageRating={averageRating}
        />
        <ReviewList
          reviews={initialReviews}
          currentUserId={currentUserId}
          productId={productId}
        />
      </div>
    </div>
  );
}
