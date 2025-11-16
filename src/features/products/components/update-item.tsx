"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sanitizeHtml } from "@/utils/sanitize";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteUpdateAction } from "../actions";
import { Update } from "../types";
import { UpdateForm } from "./update-form";

interface UpdateItemProps {
  update: Update;
  isOwner: boolean;
  productId: string;
}

export function UpdateItem({ update, isOwner, productId }: UpdateItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this update?")) return;

    startTransition(async () => {
      try {
        await deleteUpdateAction(update.id, productId);
        toast.success("Update deleted");
        router.refresh();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to delete update";
        toast.error(errorMessage);
      }
    });
  };

  if (isEditing) {
    return (
      <div className="py-4 border-b border-border last:border-0">
        <UpdateForm
          productId={productId}
          updateId={update.id}
          initialTitle={update.title}
          initialContent={update.content}
          onSuccess={() => {
            setIsEditing(false);
            router.refresh();
          }}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="py-4 border-b border-border last:border-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h3 className="font-medium">{update.title}</h3>
            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreHorizontal className="size-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isPending}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <div
            className="prose prose-sm max-w-none text-sm"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(update.content) }}
          />
          <p className="text-xs text-muted-foreground mt-2">
            {format(new Date(update.created_at), "MMM d, yyyy")}
          </p>
        </div>
      </div>
    </div>
  );
}
