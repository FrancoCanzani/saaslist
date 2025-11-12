"use client";

import { cn } from "@/lib/utils";
import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";
import { handleUpvoteAction } from "../actions";
import { Product } from "../types";

export default function UpvoteButton({
  product,
  label,
  className,
}: {
  product: Product;
  label?: string;
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
    <button
      className={cn(
        "font-medium hover:text-blaze-orange",
        optimisticProduct.is_upvoted && "hover:text-primary text-blaze-orange",
        className,
      )}
      onClick={handleUpvote}
    >
      {label && <span className="mr-1">{label}</span>}(
      {optimisticProduct.upvotes_count})
    </button>
  );
}
