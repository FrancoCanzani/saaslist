"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowRight, Heart, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { handleLikeAction } from "../actions";
import { Product } from "../types";
import FeaturedBadge from "./featured-badge";
import ProductLogo from "./product-logo";

const SWIPE_THRESHOLD = 100;
const ROTATION_FACTOR = 0.1;

export function ProductDiscoveryCard({
  product,
  onSwipe,
  isFeatured = false,
}: {
  product: Product;
  onSwipe: (productId: string, action: "like" | "skip") => void;
  isFeatured?: boolean;
}) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(product.is_liked || false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [startPos, setStartPos] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const primaryImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : product.logo_url;

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartPos(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startPos;
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;

    if (Math.abs(dragOffset) > SWIPE_THRESHOLD) {
      if (dragOffset > 0) {
        // Swipe right - like
        handleLike();
      } else {
        // Swipe left - skip
        handleSkip();
      }
    }

    setIsDragging(false);
    setDragOffset(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPos(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const diff = e.clientX - startPos;
    setDragOffset(diff);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;

    if (Math.abs(dragOffset) > SWIPE_THRESHOLD) {
      if (dragOffset > 0) {
        handleLike();
      } else {
        handleSkip();
      }
    }

    setIsDragging(false);
    setDragOffset(0);
  };

  const handleSkip = () => {
    onSwipe(product.id, "skip");
  };

  const handleLike = async () => {
    try {
      const result = await handleLikeAction(product);
      if (result.success) {
        setIsLiked(!isLiked);
        onSwipe(product.id, "like");
      } else {
        toast.error(result.error || "Failed to like product");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const rotation = dragOffset * ROTATION_FACTOR;
  const opacity = isDragging
    ? Math.max(0.5, 1 - Math.abs(dragOffset) / 300)
    : 1;

  return (
    <Card
      className="cursor-pointer space-y-4"
      style={{
        transform: `translateX(${dragOffset}px) rotate(${rotation}deg)`,
        opacity,
        transition: isDragging
          ? "none"
          : "transform 0.3s ease-out, opacity 0.3s ease-out",
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="relative w-full rounded-xl aspect-video overflow-hidden">
        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            className="object-cover pointer-events-none"
            sizes="(max-width: 768px) 100vw, 320px"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center text-muted-foreground capitalize text-xs justify-center bg-surface/50">
            No image available
          </div>
        )}
        {(isFeatured || product.is_featured) && <FeaturedBadge />}
      </div>

      <div>
        <div className="flex space-x-2 items-center justify-center">
          <ProductLogo
            logoUrl={product.logo_url}
            productName={product.name}
            size="md"
          />
          <h3 className="font-medium text-3xl">{product.name}</h3>
        </div>

        <p className="text-sm text-balance text-center text-muted-foreground line-clamp-2 mt-1.5">
          {product.tagline}
        </p>
      </div>
      <div className="flex items-center justify-center gap-3">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleSkip();
          }}
          size={"sm"}
          variant={"destructive"}
          title="Skip"
        >
          <X className="size-4" />
          <span
            className={cn(
              "",
              isDragging && dragOffset < 0 && Math.abs(dragOffset) > 50
                ? ""
                : "sr-only",
            )}
          >
            Skip
          </span>
        </Button>
        <Button
          size={"sm"}
          variant={"secondary"}
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/products/${product.id}`);
          }}
          className="rounded-full"
          title="View"
        >
          <span className="sr-only">View</span>
          <ArrowRight className="size-4" />
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleLike();
          }}
          title="Like"
          className={`rounded-full ${isLiked ? "bg-red-50 dark:bg-red-950/20" : ""}`}
          size={"sm"}
          variant={"outline"}
        >
          <Heart
            className={`size-4 ${isLiked ? "fill-red-600 text-red-600" : ""}`}
          />
          <span
            className={cn(
              "",
              isDragging && dragOffset > 0 && Math.abs(dragOffset) > 50
                ? ""
                : "sr-only",
            )}
          >
            {isLiked ? "Liked" : "Like"}
          </span>
        </Button>
      </div>
      <h3 className="text-center capitalize text-xs text-muted-foreground">
        Swipe left or right
      </h3>
    </Card>
  );
}
