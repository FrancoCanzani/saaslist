"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { formatDistanceToNowStrict } from "date-fns";
import Image from "next/image";
import { useTransition } from "react";
import { toast } from "sonner";
import { deleteReviewAction } from "../../actions";
import { Review } from "../../types";
import StarRating from "./star-rating";

interface ReviewItemProps {
  review: Review;
  currentUserId?: string;
  productId: string;
}

export default function ReviewItem({
  review,
  currentUserId,
  productId,
}: ReviewItemProps) {
  const [isPending, startTransition] = useTransition();

  const isOwner = currentUserId === review.user_id;
  const isEdited = review.updated_at !== review.created_at;

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteReviewAction(review.id, productId);
        toast.success("Review deleted!");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to delete review";
        toast.error(errorMessage);
      }
    });
  };

  return (
    <div className="border rounded p-3 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          {review.user.avatar_url ? (
            <Image
              src={review.user.avatar_url}
              alt={review.user.name}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <div className="size-10 rounded-full bg-muted flex items-center justify-center text-lg font-medium">
              {review.user.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm">{review.user.name}</span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNowStrict(new Date(review.created_at), {
                  addSuffix: true,
                })}
              </span>
              {isEdited && (
                <span className="text-xs text-muted-foreground italic">
                  (Edited)
                </span>
              )}
            </div>
            <StarRating value={review.rating} readonly size="sm" />
          </div>
        </div>

        {isOwner && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="xs"
                className="text-red-600 hover:text-red-700"
                disabled={isPending}
              >
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete review?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your review.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <Button asChild size="xs" variant="outline">
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                </Button>

                <Button asChild size="xs" variant="destructive">
                  <AlertDialogAction onClick={handleDelete}>
                    Delete
                  </AlertDialogAction>
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {review.title && <h3 className="font-medium">{review.title}</h3>}

      <p className="text-sm text-pretty">{review.content}</p>
    </div>
  );
}
