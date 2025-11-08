"use client";

import { Button } from "@/components/ui/button";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
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

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        blockquote: false,
        horizontalRule: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: "prose max-w-none focus:outline-none min-h-[100px] p-4 text-sm",
      },
    },
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  const handleSubmit = () => {
    if (!editor?.getText().trim()) return;

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
          editor?.commands.clearContent();
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

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded overflow-hidden">
      <EditorContent editor={editor} />
      <div className="py-2 px-4 flex gap-2 justify-between">
        <div className="inline-flex items-center justify-start gap-x-1 text-sm font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            viewBox="0 -960 960 960"
            width="20px"
            fill="#1f1f1f"
          >
            <path d="m640-360 120-120-42-43-48 48v-125h-60v125l-48-48-42 43 120 120ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h640v-480H160v480Zm0 0v-480 480Zm60-120h60v-180h40v120h60v-120h40v180h60v-200q0-17-11.5-28.5T440-600H260q-17 0-28.5 11.5T220-560v200Z" />
          </svg>
          <span>support</span>
        </div>
        <div className="flex gap-2">
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
            variant="outline"
            className="text-xs"
            onClick={handleSubmit}
            disabled={isPending || !editor?.getText().trim()}
          >
            {submitLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
