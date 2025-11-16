"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";
import { handleLikeAction } from "../actions";
import { Product } from "../types";

export default function LikeButton({
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
    (state, newLike) =>
      newLike
        ? {
            ...state,
            likes_count: state.likes_count + 1,
            is_liked: true,
          }
        : {
            ...state,
            likes_count: state.likes_count - 1,
            is_liked: false,
          },
  );

  async function handleLike(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    startTransition(async () => {
      addOptimisticProduct(!optimisticProduct.is_liked);

      const result = await handleLikeAction(optimisticProduct);

      if (!result.success) {
        addOptimisticProduct(optimisticProduct.is_liked);

        const errorMessage = result.error || "Something went wrong";
        toast.error(errorMessage);
      }
    });
  }

  return (
    <Button
      variant={"secondary"}
      size={size}
      className={cn(
        "bg-blaze-orange/10 hover:bg-blaze-orange/20 text-black dark:bg-secondary dark:text-white dark:hover:bg-secondary/80",
        optimisticProduct.is_liked &&
          "font-medium bg-emerald-100 hover:bg-emerald-50",
        isPending && "animate-pulse",
        className,
      )}
      onClick={handleLike}
    >
      <Heart
        className={cn(
          "size-3.5",
          optimisticProduct.is_liked && "fill-current"
        )}
      />{" "}
      {optimisticProduct.is_liked ? (
        <span>Liked</span>
      ) : (
        <span>Like</span>
      )}
      ({optimisticProduct.likes_count})
    </Button>
  );
}

