"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { createReviewAction } from "../actions";
import StarRating from "./star-rating";

interface ReviewFormProps {
  productId: string;
  onSuccess?: () => void;
}

export default function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        await createReviewAction({
          rating,
          title: title || undefined,
          content,
          product_id: productId,
        });

        setRating(0);
        setTitle("");
        setContent("");
        toast.success("Review submitted!");
        onSuccess?.();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to submit review";
        toast.error(errorMessage);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="rating" className="block text-sm font-medium mb-2">
          How would you rate it overall? *
        </Label>
        <StarRating value={rating} onChange={setRating} size="md" />
      </div>

      <div>
        <Label htmlFor="title" className="block text-sm font-medium mb-2">
          Review Title (optional)
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Sum up your experience..."
          maxLength={100}
          disabled={isPending}
        />
      </div>

      <div>
        <Label htmlFor="content" className="block text-sm font-medium mb-2">
          Your Review *
        </Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your experience with this product... (minimum 50 characters)"
          rows={8}
          maxLength={2000}
          disabled={isPending}
          className="resize-none min-h-[100px]"
        />
        <p className="text-xs text-muted-foreground mt-2">
          {content.length}/2000 characters
          {content.length < 50 && ` (${50 - content.length} more needed)`}
        </p>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          size="xs"
          disabled={isPending || rating === 0 || content.length < 50}
        >
          {isPending ? "Submitting..." : "Submit Review"}
        </Button>
      </div>
    </form>
  );
}
