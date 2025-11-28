"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/features/products/components/product-card";
import { Product } from "@/features/products/types";
import { Category } from "@/utils/types";
import { parseAsString, useQueryState } from "nuqs";
import { useMemo } from "react";

interface CategoryContentProps {
  category: Category;
  products: Product[];
}

export function CategoryContent({ category, products }: CategoryContentProps) {
  const [selectedTag, setSelectedTag] = useQueryState(
    "tag",
    parseAsString.withDefault("").withOptions({ shallow: false })
  );

  const filteredProducts = useMemo(() => {
    if (!selectedTag) return products;

    return products.filter((product) =>
      product.tags?.some(
        (tag) => tag.toLowerCase() === selectedTag.toLowerCase()
      )
    );
  }, [products, selectedTag]);

  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>();
    category.tags.forEach((tag) => {
      const count = products.filter((product) =>
        product.tags?.some((t) => t.toLowerCase() === tag.toLowerCase())
      ).length;
      counts.set(tag, count);
    });
    return counts;
  }, [category.tags, products]);

  const handleTagClick = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag(null);
    } else {
      setSelectedTag(tag);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 w-full">
      <div>
        <h1 className="text-xl font-medium">{category.name}</h1>
        {category.description && (
          <h2 className="text-muted-foreground text-sm">{category.description}</h2>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {category.tags.map((tag) => {
          const count = tagCounts.get(tag) || 0;
          const isSelected = selectedTag === tag;
          const isDisabled = count === 0;

          return (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              disabled={isDisabled}
            >
              <Badge
                variant={isSelected ? "default" : "secondary"}
                className={
                  isDisabled
                    ? "opacity-40 cursor-not-allowed"
                    : "cursor-pointer hover:bg-primary/80 hover:text-primary-foreground transition-colors"
                }
              >
                {tag}
                <span className="ml-1 opacity-70">({count})</span>
              </Badge>
            </button>
          );
        })}
        {selectedTag && (
          <button onClick={() => setSelectedTag(null)}>
            <Badge variant="outline" className="cursor-pointer">
              Clear filter
            </Badge>
          </button>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
          {selectedTag && ` in "${selectedTag}"`}
        </span>
      </div>

      {filteredProducts.length === 0 ? (
        <Alert>
          <AlertDescription className="mx-auto">
            {selectedTag
              ? `No products found with tag "${selectedTag}"`
              : "No products in this category yet."}
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-4 flex flex-col">
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} position={index + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

