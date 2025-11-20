"use client";

import { Comment } from "../../types";
import CommentItem from "./comment-item";

interface CommentListProps {
  comments: Comment[];
  currentUserId?: string;
  depth?: number;
  maxDepth?: number;
  productId: string;
}

export default function CommentList({
  comments,
  currentUserId,
  depth = 0,
  maxDepth = 5,
  productId,
}: CommentListProps) {
  if (comments.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {comments.map((comment, index) => (
        <div key={comment.id} className="group/thread">
          <CommentItem
            comment={comment}
            currentUserId={currentUserId}
            depth={depth}
            maxDepth={maxDepth}
            productId={productId}
            isFirst={index === 0}
          />
          {comment.replies && comment.replies.length > 0 && (
            <div className="pl-4 sm:pl-8">
              <CommentList
                comments={comment.replies}
                currentUserId={currentUserId}
                depth={depth + 1}
                maxDepth={maxDepth}
                productId={productId}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
