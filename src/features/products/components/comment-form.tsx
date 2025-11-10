"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { createCommentAction, updateCommentAction } from "../actions";

interface CommentFormProps {
  productId: string;
  parentId?: string | null;
  commentId?: string;
  initialContent?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  submitLabel?: string;
  placeholder?: string;
}

export default function CommentForm({
  productId,
  parentId = null,
  commentId,
  initialContent = "",
  onSuccess,
  onCancel,
  submitLabel = "Comment",
  placeholder = "Write a comment...",
}: CommentFormProps) {
  const [content, setContent] = useState(initialContent);
  const [isPending, startTransition] = useTransition();
  const isEditMode = !!commentId;

  const handleSubmit = () => {
    if (!content.trim()) return;

    startTransition(async () => {
      try {
        if (isEditMode) {
          await updateCommentAction(commentId, content, productId);
        } else {
          await createCommentAction({
            content,
            product_id: productId,
            parent_id: parentId,
          });
        }

        if (!isEditMode) {
          setContent("");
        }
        onSuccess?.();
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : `Failed to ${isEditMode ? "update" : "post"} comment`;
        toast.error(errorMessage);
      }
    });
  };

  return (
    <div className="space-y-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        className="resize-none text-xs sm:text-sm min-h-[100px]"
        disabled={isPending}
      />
      <div className="flex gap-2 justify-end">
          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={onCancel}
              disabled={isPending}
            >
              Cancel
            </Button>
          )}
          <Button
            type="button"
            size="xs"
            className="text-xs"
            onClick={handleSubmit}
            disabled={isPending || !content.trim()}
          >
            {submitLabel}
          </Button>
      </div>
    </div>
  );
}
