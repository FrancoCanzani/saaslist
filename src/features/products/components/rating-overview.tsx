"use client";

import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { Review } from "../types";
import StarRating from "./star-rating";

interface RatingOverviewProps {
  reviews: Review[];
  averageRating: number;
}

export default function RatingOverview({
  reviews,
  averageRating,
}: RatingOverviewProps) {
  const stats = useMemo(() => {
    const distribution: Record<number, number> = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };
    reviews.forEach((review) => {
      distribution[review.rating]++;
    });

    const total = reviews.length;
    const percentages: Record<number, number> = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    if (total > 0) {
      Object.keys(distribution).forEach((rating) => {
        const r = parseInt(rating);
        percentages[r] = (distribution[r] / total) * 100;
      });
    }

    return { distribution, percentages, total };
  }, [reviews]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="text-center">
          <div className="text-2xl font-medium">{averageRating.toFixed(1)}</div>
          <StarRating
            value={averageRating}
            readonly
            size="sm"
            className="justify-center mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {stats.total} review{stats.total !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center justify-end gap-2">
              <span className="text-xs">{rating} ★</span>
              <div className="flex-1 h-1.5 rounded-r-full bg-muted overflow-hidden">
                <div
                  className={cn("h-full transition-all bg-yellow-400")}
                  style={{ width: `${stats.percentages[rating]}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground text-right">
                {stats.distribution[rating]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
