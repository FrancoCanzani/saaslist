"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";
import { handleUpvoteAction } from "../actions";
import { Product } from "../types";

export default function UpvoteButton({
  product,
  label,
  size = "sm",
  className,
}: {
  product: Product;
  label?: string;
  size: "xs" | "sm" | "default" | "lg" | null | undefined;
  className?: string;
}) {
  const [isPending, startTransition] = useTransition();

  const [optimisticProduct, addOptimisticProduct] = useOptimistic(
    product,
    (state, newUpvote) =>
      newUpvote
        ? {
            ...state,
            upvotes_count: state.upvotes_count + 1,
            is_upvoted: true,
          }
        : {
            ...state,
            upvotes_count: state.upvotes_count - 1,
            is_upvoted: false,
          },
  );

  async function handleUpvote(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    startTransition(async () => {
      addOptimisticProduct(!optimisticProduct.is_upvoted);

      try {
        const result = await handleUpvoteAction(optimisticProduct);
      } catch (error) {
        addOptimisticProduct(optimisticProduct.is_upvoted);

        const errorMessage =
          error instanceof Error ? error.message : "Something went wrong";
        toast.error(errorMessage);
      }
    });
  }

  return (
    <Button
      variant={"outline"}
      size={size}
      className={cn(
        "text-xs font-medium",
        optimisticProduct.is_upvoted &&
          "text-white hover:text-white leading-none dark:bg-blaze-orange bg-blaze-orange hover:bg-blaze-orange/90 dark:hover:bg-blaze-orange/90",
        className,
      )}
      onClick={handleUpvote}
    >
      {optimisticProduct.upvotes_count}
      {label && <span>{label}</span>}
    </Button>
  );
}
