"use client";

import { Comment, Review, Update } from "../../types";
import CommentItem from "./comment-item";
import CommentList from "./comment-list";
import ReviewItem from "./review-item";
import { UpdateItem } from "./update-item";

interface FeedItemProps {
  type: "review" | "comment" | "update";
  data: Review | Comment | Update;
  productId: string;
  currentUserId?: string;
  isOwner: boolean;
}

export function FeedItem({
  type,
  data,
  productId,
  currentUserId,
  isOwner,
}: FeedItemProps) {
  const typeLabels = {
    review: "Review",
    comment: "Comment",
    update: "Update",
  };

  const comment = data as Comment;
  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{typeLabels[type]}</span>
        <div className="flex-1 mt-1 h-px bg-border w-full" />
      </div>
      <div>
        {type === "review" && (
          <ReviewItem
            review={data as Review}
            currentUserId={currentUserId}
            productId={productId}
          />
        )}
        {type === "comment" && (
          <div className="group/thread">
            <CommentItem
              comment={comment}
              currentUserId={currentUserId}
              depth={0}
              maxDepth={5}
              productId={productId}
              isFirst={true}
            />
            {hasReplies && (
              <div className="pl-3 sm:pl-6">
                <CommentList
                  comments={comment.replies!}
                  currentUserId={currentUserId}
                  depth={1}
                  maxDepth={5}
                  productId={productId}
                />
              </div>
            )}
          </div>
        )}
        {type === "update" && (
          <UpdateItem
            update={data as Update}
            isOwner={isOwner}
            productId={productId}
          />
        )}
      </div>
    </div>
  );
}
