"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronUp } from "lucide-react";
import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";
import { handleUpvoteAction } from "../actions";
import { Product } from "../types";

export default function UpvoteButton({
  product,
  className,
  size = "sm",
}: {
  product: Product;
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
        "bg-blaze-orange/10 hover:bg-blaze-orange/20 dark:bg-blaze-orange/10 dark:hover:bg-blaze-orange/20",
        optimisticProduct.is_upvoted &&
          "font-medium bg-emerald-100 hover:bg-emerald-50 dark:bg-emerald-100 dark:hover:bg-emerald-50 dark:text-black",
        isPending && "animate-pulse",
        className,
      )}
      onClick={handleUpvote}
    >
      {optimisticProduct.is_upvoted && <ChevronUp className="size-3.5" />}{" "}
      {optimisticProduct.is_upvoted ? (
        <span>Upvoted</span>
      ) : (
        <span>Upvote</span>
      )}
      ({optimisticProduct.upvotes_count})
    </Button>
  );
}
