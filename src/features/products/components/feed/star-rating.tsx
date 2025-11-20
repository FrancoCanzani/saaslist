"use client";

import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
  value: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
};

export default function StarRating({
  value,
  onChange,
  readonly = false,
  size = "md",
  showValue = false,
  className,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const displayRating = hoverRating || value;

  const handleClick = (rating: number) => {
    if (!readonly && onChange) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating: number) => {
    if (!readonly) {
      setHoverRating(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((rating) => {
          const isFilled = rating <= displayRating;
          const isPartial =
            rating === Math.ceil(displayRating) &&
            displayRating % 1 !== 0 &&
            hoverRating === 0;

          return (
            <button
              key={rating}
              type="button"
              onClick={() => handleClick(rating)}
              onMouseEnter={() => handleMouseEnter(rating)}
              onMouseLeave={handleMouseLeave}
              disabled={readonly}
              className={cn(
                "transition-colors relative",
                !readonly && "cursor-pointer hover:scale-110",
                readonly && "cursor-default",
              )}
              aria-label={`${rating} star${rating !== 1 ? "s" : ""}`}
            >
              {isPartial ? (
                <div className="relative">
                  <Star
                    className={cn(sizeClasses[size], "text-muted-foreground")}
                  />
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ width: `${(displayRating % 1) * 100}%` }}
                  >
                    <Star
                      className={cn(
                        sizeClasses[size],
                        "fill-yellow-400 text-yellow-400",
                      )}
                    />
                  </div>
                </div>
              ) : (
                <Star
                  className={cn(
                    sizeClasses[size],
                    isFilled
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground",
                    !readonly &&
                      hoverRating > 0 &&
                      "transition-all duration-150",
                  )}
                />
              )}
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm text-muted-foreground ml-1">
          {displayRating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

