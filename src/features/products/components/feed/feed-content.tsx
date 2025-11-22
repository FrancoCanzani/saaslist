"use client";

import { useMemo } from "react";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { Comment, Review, Update } from "../../types";
import { FeedItem } from "./feed-item";
import { FeedFilter } from "./feed-filter";
import { FeedActions } from "./feed-actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { buildCommentTree } from "../../helpers";

interface FeedContentProps {
  productId: string;
  comments: Comment[];
  reviews: Review[];
  updates: Update[];
  currentUserId?: string;
  isOwner: boolean;
  hasUserReviewed: boolean;
}

export type FeedType = "all" | "reviews" | "comments" | "updates";

export function FeedContent({
  productId,
  comments,
  reviews,
  updates,
  currentUserId,
  isOwner,
  hasUserReviewed,
}: FeedContentProps) {
  const [filter, setFilter] = useQueryState(
    "feed",
    parseAsStringLiteral<FeedType>(["all", "reviews", "comments", "updates"]).withDefault("all")
  );

  const feedItems = useMemo(() => {
    const items: Array<{
      type: "review" | "comment" | "update";
      id: string;
      created_at: string;
      data: Review | Comment | Update;
    }> = [];

    if (filter === "all" || filter === "reviews") {
      reviews.forEach((review) => {
        items.push({
          type: "review",
          id: review.id,
          created_at: review.created_at,
          data: review,
        });
      });
    }

    if (filter === "all" || filter === "comments") {
      const commentTree = buildCommentTree(comments);
      commentTree.forEach((comment) => {
        items.push({
          type: "comment",
          id: comment.id,
          created_at: comment.created_at,
          data: comment,
        });
      });
    }

    if (filter === "all" || filter === "updates") {
      updates.forEach((update) => {
        items.push({
          type: "update",
          id: update.id,
          created_at: update.created_at,
          data: update,
        });
      });
    }

    return items.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [reviews, comments, updates, filter]);

  return (
    <div className="py-8 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h2 className="font-medium text-lg">Activity Feed</h2>
        <div className="flex w-full md:w-auto items-center justify-between md:justify-start gap-2">
          <FeedActions
            productId={productId}
            currentUserId={currentUserId}
            isOwner={isOwner}
            hasUserReviewed={hasUserReviewed}
          />
          <FeedFilter filter={filter} onFilterChange={setFilter} />
        </div>
      </div>

      {feedItems.length > 0 ? (
        <div className="space-y-4">
          {feedItems.map((item) => (
            <FeedItem
              key={`${item.type}-${item.id}`}
              type={item.type}
              data={item.data}
              productId={productId}
              currentUserId={currentUserId}
              isOwner={isOwner}
            />
          ))}
        </div>
      ) : (
        <Alert>
          <AlertDescription className="mx-auto">
            {filter === "all"
              ? "No activity yet. Be the first to engage!"
              : `No ${filter} yet.`}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

