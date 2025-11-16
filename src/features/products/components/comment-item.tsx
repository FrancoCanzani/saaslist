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
import { cn } from "@/lib/utils";
import { sanitizeHtml } from "@/utils/sanitize";
import { formatDistanceToNowStrict } from "date-fns";
import Image from "next/image";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteCommentAction, flagCommentAction } from "../actions";
import { Comment } from "../types";
import CommentForm from "./comment-form";

interface CommentItemProps {
  comment: Comment;
  currentUserId?: string;
  depth: number;
  maxDepth: number;
  productId: string;
  isFirst?: boolean;
}

export default function CommentItem({
  comment,
  currentUserId,
  depth,
  maxDepth,
  productId,
  isFirst = false,
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isOwner = currentUserId === comment.user_id;
  const canReply = depth < maxDepth;
  const isEdited = comment.updated_at !== comment.created_at;

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteCommentAction(comment.id, productId);
        toast.success("Comment deleted!");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to delete comment";
        toast.error(errorMessage);
      }
    });
  };

  const handleFlag = () => {
    startTransition(async () => {
      try {
        await flagCommentAction(comment.id, productId);
        toast.success("Comment flagged for review");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to flag comment";
        toast.error(errorMessage);
      }
    });
  };

  const isReply = depth > 0;
  const showTopBorder = depth === 0 || (isReply && !isFirst);

  return (
    <div
      className={cn(
        "border-x border-b rounded-r-xl rounded-b-xl p-3 transition-colors group-hover/thread:bg-gray-50",
        showTopBorder && "border-t rounded-t-xl",
        isReply && "border-l",
      )}
    >
      <div className="flex gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="gap-2 flex items-center justify-start">
              {comment.user.avatar_url ? (
                <Image
                  src={comment.user.avatar_url}
                  alt={comment.user.name}
                  width={20}
                  height={20}
                  className="rounded-full"
                />
              ) : (
                <div className="size-6 rounded-full flex items-center justify-center text-sm font-medium">
                  {comment.user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="font-medium text-sm">{comment.user.name}</span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNowStrict(new Date(comment.created_at), {
                  addSuffix: true,
                })}
              </span>
              {isEdited && (
                <span className="text-xs text-muted-foreground italic">
                  (Edited)
                </span>
              )}
              {comment.is_flagged && (
                <span className="text-xs text-red-500">Flagged</span>
              )}
            </div>

            <div className="flex">
              {canReply && currentUserId && (
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => {
                    setIsReplying(!isReplying);
                    setIsEditing(false);
                  }}
                >
                  Reply
                </Button>
              )}

              {isOwner && (
                <>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => {
                      setIsReplying(false);
                      setIsEditing(true);
                    }}
                  >
                    Edit
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="xs"
                        className=" text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete comment?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your comment.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <Button asChild size={"xs"} variant={"outline"}>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                        </Button>

                        <Button asChild size={"xs"} variant={"destructive"}>
                          <AlertDialogAction onClick={handleDelete}>
                            Delete
                          </AlertDialogAction>
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}

              {!isOwner && currentUserId && !comment.is_flagged && (
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={handleFlag}
                  disabled={isPending}
                >
                  Flag
                </Button>
              )}
            </div>
          </div>

          {isEditing ? (
            <div className="my-3">
              <CommentForm
                productId={productId}
                commentId={comment.id}
                initialContent={comment.content}
                onSuccess={() => setIsEditing(false)}
                onCancel={() => setIsEditing(false)}
                submitLabel="Save"
                placeholder="Edit your comment..."
              />
            </div>
          ) : (
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(comment.content) }}
            />
          )}

          {isReplying && (
            <div className="my-3">
              <CommentForm
                productId={productId}
                parentId={comment.id}
                onSuccess={() => setIsReplying(false)}
                onCancel={() => setIsReplying(false)}
                submitLabel="Reply"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
