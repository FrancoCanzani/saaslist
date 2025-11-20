"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getCategoryByTag, getTagSlug } from "@/utils/helpers";
import { OliveBranchIcon } from "@/utils/icons";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "../types";
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
      <Card className="flex rounded-xl bg-surface/20 border-border/50 hover:border-border transition-all duration-300 hover:bg-surface/80 group flex-col gap-3 p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start justify-start gap-3 flex-1 min-w-0">
            <div className="size-9 rounded-lg group-hover:bg-background flex items-center justify-center shrink-0">
              <ProductLogo
                logoUrl={product.logo_url}
                productName={product.name}
                size={38}
              />
            </div>

            <div className="flex-1 flex flex-col min-w-0">
              <div className="flex items-center gap-1">
                {position && (
                  <span className="text-muted-foreground font-medium">
                    #{position}
                  </span>
                )}
                <h3 className="flex line-clamp-1 items-center font-medium text-base md:text-lg truncate gap-x-1">
                  {product.name}
                  <ArrowRight className="opacity-0 transition-all group-hover:opacity-100 duration-300 size-3.5 shrink-0" />
                </h3>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {product.tagline}
              </p>
              <div className="md:flex flex-wrap hidden gap-1.5 mt-2">
                {product.tags.map((tag: string, index: number) => {
                  const category = getCategoryByTag(tag);
                  return category ? (
                    <Badge
                      key={index}
                      className="hover:underline rounded font-normal text-xs cursor-pointer"
                      variant={"secondary"}
                      onClick={(e) =>
                        handleTagClick(e, category.slug, getTagSlug(tag))
                      }
                    >
                      {tag}
                    </Badge>
                  ) : (
                    <Badge
                      key={index}
                      variant={"secondary"}
                      className="text-xs"
                    >
                      {tag}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {product.is_featured && (
              <div className="flex items-center border h-7 px-2 py-1.5 text-xs rounded-lg gap-1.5">
                <OliveBranchIcon className="text-amber-500" />
                <span className="font-medium hidden md:block text-muted-foreground">
                  Featured
                </span>
              </div>
            )}
            <LikeButton product={product} size="xs" />
          </div>
        </div>
      </Card>
    </Link>
  );
}
