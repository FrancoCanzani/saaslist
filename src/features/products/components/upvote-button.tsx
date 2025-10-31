"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Triangle } from "lucide-react";
import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";
import { handleUpvoteAction } from "../actions";
import { Product } from "../types";

export default function UpvoteButton({ product }: { product: Product }) {
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

        console.error("Upvote error:", error);
      }
    });
  }

  return (
    <Button
      variant={"secondary"}
      size={"sm"}
      className={cn(
        "text-xs font-medium",
        optimisticProduct.is_upvoted
          ? "bg-orange-500 hover:bg-orange-600 text-white"
          : "",
      )}
      onClick={handleUpvote}
    >
      <Triangle
        className={`size-3 ${optimisticProduct.is_upvoted ? "fill-current" : ""} ${
          isPending ? "animate-pulse" : ""
        }`}
      />
      {optimisticProduct.upvotes_count}
    </Button>
  );
}
