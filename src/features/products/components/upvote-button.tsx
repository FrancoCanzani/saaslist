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
  className,
  size = "sm",
}: {
  product: Product;
  label?: string;
  className?: string;
  size?: "xs" | "sm" | "default" | "lg" | "icon";
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
      variant={"secondary"}
      size={size}
      className={cn(
        "bg-blaze-orange/10 hover:bg-blaze-orange/20",
        optimisticProduct.is_upvoted && "",
        className,
      )}
      onClick={handleUpvote}
    >
      {label && <span>{label}</span>}({optimisticProduct.upvotes_count})
    </Button>
  );
}
