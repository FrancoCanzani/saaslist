"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { useMemo } from "react";
import { sortReviews } from "../helpers";
import { Review, ReviewSortOption } from "../types";
import ReviewItem from "./review-item";

interface ReviewListProps {
  reviews: Review[];
  currentUserId?: string;
  productId: string;
}

const sortOptions: Record<ReviewSortOption, string> = {
  newest: "Newest",
  highest: "Highest Rating",
  lowest: "Lowest Rating",
};

export default function ReviewList({
  reviews,
  currentUserId,
  productId,
}: ReviewListProps) {
  const [sortBy, setSortBy] = useQueryState(
    "reviewSort",
    parseAsStringLiteral(["newest", "highest", "lowest"]).withDefault("newest"),
  );

  const [filterRating, setFilterRating] = useQueryState(
    "rating",
    parseAsStringLiteral(["all", "5", "4", "3", "2", "1"]).withDefault("all"),
  );

  const filteredAndSortedReviews = useMemo(() => {
    let filtered = reviews;

    if (filterRating !== "all") {
      const ratingNum = parseInt(filterRating);
      filtered = reviews.filter((review) => review.rating === ratingNum);
    }

    return sortReviews(filtered, sortBy);
  }, [reviews, sortBy, filterRating]);

  const ratingCounts = useMemo(() => {
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      counts[review.rating]++;
    });
    return counts;
  }, [reviews]);

  if (reviews.length === 0) {
    return (
      <Alert>
        <AlertDescription className="mx-auto">
          No reviews yet. Be the first to share your thoughts!
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-4">
        <Select
          value={filterRating}
          onValueChange={(value) =>
            setFilterRating(value as "all" | "5" | "4" | "3" | "2" | "1")
          }
        >
          <SelectTrigger size="xs" className="text-xs">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">
              All Ratings ({reviews.length})
            </SelectItem>
            {[5, 4, 3, 2, 1].map((rating) => (
              <SelectItem
                key={rating}
                value={rating.toString()}
                className="text-xs"
              >
                {rating} Star{rating !== 1 ? "s" : ""} ({ratingCounts[rating]})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={sortBy}
          onValueChange={(value) => setSortBy(value as ReviewSortOption)}
        >
          <SelectTrigger size="xs" className="text-xs">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {(Object.entries(sortOptions) as [ReviewSortOption, string][]).map(
              ([value, label]) => (
                <SelectItem key={value} value={value} className="text-xs">
                  {label}
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>
      </div>

      {filteredAndSortedReviews.length > 0 ? (
        <div className="space-y-4">
          {filteredAndSortedReviews.map((review) => (
            <ReviewItem
              key={review.id}
              review={review}
              currentUserId={currentUserId}
              productId={productId}
            />
          ))}
        </div>
      ) : (
        <Alert>
          <AlertDescription className="mx-auto">
            No reviews match your filter.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
