"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { OliveBranchIcon } from "@/utils/icons";
import { ArrowRight, Heart, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { handleLikeAction } from "../actions";
import { Product } from "../types";
import ProductLogo from "./product-logo";

interface ProductDiscoveryCardProps {
  product: Product;
  onSwipe: (productId: string, action: "like" | "skip") => void;
  isFeatured?: boolean;
}

const SWIPE_THRESHOLD = 100;
const ROTATION_FACTOR = 0.1;

export function ProductDiscoveryCard({
  product,
  onSwipe,
  isFeatured = false,
}: ProductDiscoveryCardProps) {
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
    <div className="relative">
      <Card
        ref={cardRef}
        className="bg-surface/20 border-border/50 hover:border-border transition-all py-0 duration-200 gap-4 cursor-grab active:cursor-grabbing select-none"
        style={{
          transform: `translateX(${dragOffset}px) rotate(${rotation}deg)`,
          opacity,
          transition: isDragging ? "none" : "transform 0.3s ease-out, opacity 0.3s ease-out",
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
          {(isFeatured || product.is_featured) && (
            <div className="absolute top-2 right-2 flex items-center border bg-background/90 backdrop-blur-sm h-7 px-2 py-1.5 text-xs rounded-lg gap-1.5 z-10">
              <OliveBranchIcon className="text-amber-500 size-3.5" />
              <span className="font-medium text-muted-foreground">Featured</span>
            </div>
          )}
          {isDragging && Math.abs(dragOffset) > 50 && (
            <div
              className={`absolute inset-0 flex items-center justify-center text-2xl font-bold z-20 ${
                dragOffset > 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {dragOffset > 0 ? "LIKE" : "SKIP"}
            </div>
          )}
        </div>

        <div className="pb-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="size-10 pt-2 rounded-xl bg-background flex items-center justify-center shrink-0">
                <ProductLogo
                  logoUrl={product.logo_url}
                  productName={product.name}
                  size={40}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-lg line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {product.tagline}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleSkip();
              }}
              size={"lg"}
              className="rounded-full"
            >
              <X className="size-4" />
              <span className="sr-only">Skip</span>
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleLike();
              }}
              className={`rounded-full ${isLiked ? "bg-red-50 dark:bg-red-950/20" : ""}`}
              size={"lg"}
            >
              <Heart
                className={`size-4 ${isLiked ? "fill-red-600 text-red-600" : ""}`}
              />
              <span className="sr-only">{isLiked ? "Liked" : "Like"}</span>
            </Button>
            <Button
              size={"lg"}
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/products/${product.id}`);
              }}
              className="rounded-full"
            >
              <span className="sr-only">View</span>
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
