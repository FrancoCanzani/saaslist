"use client";

import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import Link from "next/link";
import { CommentActionDialog } from "./comment-action-dialog";
import { ReviewActionDialog } from "./review-action-dialog";
import { UpdateActionDialog } from "./update-action-dialog";

interface FeedActionsProps {
  productId: string;
  currentUserId?: string;
  isOwner: boolean;
  hasUserReviewed: boolean;
}

export function FeedActions({
  productId,
  currentUserId,
  isOwner,
  hasUserReviewed,
}: FeedActionsProps) {
  const isMobile = useIsMobile();

  if (!currentUserId)
    return (
      <Button asChild size={"xs"} variant={"secondary"}>
        <Link href="/login">Sign In to Post</Link>
      </Button>
    );

  return (
    <div className="flex items-center gap-2">
      {!hasUserReviewed && (
        <ReviewActionDialog productId={productId} isMobile={isMobile}>
          <Button size="xs" variant="outline">
            Review
          </Button>
        </ReviewActionDialog>
      )}
      <CommentActionDialog productId={productId} isMobile={isMobile}>
        <Button size="xs" variant="outline">
          Comment
        </Button>
      </CommentActionDialog>
      {isOwner && (
        <UpdateActionDialog productId={productId} isMobile={isMobile}>
          <Button size="xs" variant="outline">
            Update
          </Button>
        </UpdateActionDialog>
      )}
    </div>
  );
}
