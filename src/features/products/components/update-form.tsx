"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UpdateEditor } from "./update-editor";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  createUpdateAction,
  updateUpdateAction,
} from "../actions";

interface UpdateFormProps {
  productId: string;
  updateId?: string;
  initialTitle?: string;
  initialContent?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function UpdateForm({
  productId,
  updateId,
  initialTitle = "",
  initialContent = "",
  onSuccess,
  onCancel,
}: UpdateFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [isPending, startTransition] = useTransition();
  const isEditMode = !!updateId;

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    startTransition(async () => {
      try {
        if (isEditMode) {
          await updateUpdateAction({
            updateId,
            title: title.trim(),
            content: content.trim(),
            product_id: productId,
          });
        } else {
          await createUpdateAction({
            title: title.trim(),
            content: content.trim(),
            product_id: productId,
          });
        }

        if (!isEditMode) {
          setTitle("");
          setContent("");
        }
        onSuccess?.();
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : `Failed to ${isEditMode ? "update" : "create"} update`;
        toast.error(errorMessage);
      }
    });
  };

  return (
    <div className="space-y-4">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Update title..."
        className="text-sm"
        disabled={isPending}
      />
      <UpdateEditor
        content={content}
        onChange={setContent}
        placeholder="What's new?"
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
          onClick={handleSubmit}
          disabled={isPending || !title.trim() || !content.trim()}
        >
          {isPending
            ? isEditMode
              ? "Updating..."
              : "Creating..."
            : isEditMode
              ? "Update"
              : "Post Update"}
        </Button>
      </div>
    </div>
  );
}

