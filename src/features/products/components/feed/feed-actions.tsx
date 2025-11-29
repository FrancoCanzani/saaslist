"use client";

import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CommentActionDialog } from "./comment-action-dialog";
import { ReviewActionDialog } from "./review-action-dialog";
import { UpdateActionDialog } from "./update-action-dialog";
import { getLoginUrl } from "@/utils/helpers";

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
  const pathname = usePathname();

  if (!currentUserId)
    return (
      <Button asChild size={"xs"} variant={"secondary"}>
        <Link href={getLoginUrl(pathname)}>Sign In to Post</Link>
      </Button>
    );

  return (
    <div className="flex items-center gap-2">
      {!hasUserReviewed && (
        <ReviewActionDialog productId={productId} isMobile={isMobile}>
          <Button size="xs" variant="outline">
            Add Review
          </Button>
        </ReviewActionDialog>
      )}
      <CommentActionDialog productId={productId} isMobile={isMobile}>
        <Button size="xs" variant="outline">
          Add Comment
        </Button>
      </CommentActionDialog>
      {isOwner && (
        <UpdateActionDialog productId={productId} isMobile={isMobile}>
          <Button size="xs" variant="outline">
            Add Update
          </Button>
        </UpdateActionDialog>
      )}
    </div>
  );
}
