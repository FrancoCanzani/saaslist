"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getCategoryByTag, getTagSlug } from "@/utils/helpers";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "../types";
import FeaturedBadge from "./featured-badge";
import LikeButton from "./like-button";
import ProductLogo from "./product-logo";

export default function ProductCard({
  product,
  position,
}: {
  product: Product;
  position?: number;
}) {
  const router = useRouter();

  // this is necesary as we cannot nest Link components
  const handleTagClick = (
    e: React.MouseEvent,
    categorySlug: string,
    tagSlug: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/browse/${categorySlug}/${tagSlug}`);
  };

  return (
    <Link prefetch href={`/products/${product.id}`}>
      <Card className="flex flex-row items-start gap-3">
        <ProductLogo
          logoUrl={product.logo_url}
          productName={product.name}
          size="lg"
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-1 min-w-0">
            {position && (
              <span className="text-muted-foreground font-medium shrink-0">
                #{position}
              </span>
            )}
            <h3 className="flex items-center font-semibold text-base min-w-0 flex-1 gap-x-1">
              <span className="truncate">{product.name}</span>
              <ArrowRight className="opacity-0 transition-all group-hover:opacity-100 duration-300 size-3.5 shrink-0" />
            </h3>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.tagline}
          </p>
          <div className="md:flex flex-wrap hidden gap-1.5 mt-2.5">
            {product.tags.map((tag: string, index: number) => {
              const category = getCategoryByTag(tag);
              return category ? (
                <Badge
                  key={index}
                  className="hover:underline cursor-pointer"
                  variant={"secondary"}
                  onClick={(e) =>
                    handleTagClick(e, category.slug, getTagSlug(tag))
                  }
                >
                  {tag}
                </Badge>
              ) : (
                <Badge key={index} variant={"secondary"}>
                  {tag}
                </Badge>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {product.is_featured && <FeaturedBadge className="h-7" />}
          <LikeButton product={product} size="xs" hideText />
        </div>
      </Card>
    </Link>
  );
}
