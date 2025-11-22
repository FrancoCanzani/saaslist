"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type VariantProps } from "class-variance-authority";
import { Heart } from "lucide-react";
import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";
import { handleLikeAction } from "../actions";
import { Product } from "../types";

export default function LikeButton({
  product,
  className,
  size = "xs",
  variant = "outline",
  hideText = false,
}: {
  product: Product;
  className?: string;
  hideText?: boolean;
} & Pick<VariantProps<typeof buttonVariants>, "size" | "variant">) {
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
      variant={variant}
      size={size}
      className={cn("", isPending && "animate-pulse", className)}
      onClick={handleLike}
    >
      <Heart
        className={cn("size-3.5", optimisticProduct.is_liked && "fill-red-600")}
      />
      <span className={cn(hideText && "hidden md:inline")}>
        {optimisticProduct.is_liked ? "Liked" : "Like"}
      </span>
      <span className={cn(hideText ? "md:border-l md:pl-2" : "border-l pl-2")}>
        {optimisticProduct.likes_count}
      </span>
    </Button>
  );
}
