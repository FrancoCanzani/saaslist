"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EmptyGridCell from "@/features/products/components/empty-grid-cell";
import ProductGridCard from "@/features/products/components/product-grid-card";
import { Product } from "@/features/products/types";
import { Category } from "@/utils/types";
import Fuse from "fuse.js";
import { X } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { useMemo } from "react";

interface CategoryProductsProps {
  category: Category;
  products: Product[];
}

export default function CategoryProducts({
  category,
  products,
}: CategoryProductsProps) {
  const [search, setSearch] = useQueryState("search", {
    defaultValue: "",
    clearOnDefault: true,
  });

  const [tag, setTag] = useQueryState("tag", parseAsString.withDefault(""));

  const fuse = useMemo(
    () =>
      new Fuse(products, {
        keys: [
          { name: "name", weight: 0.5 },
          { name: "tagline", weight: 0.3 },
          { name: "tags", weight: 0.2 },
        ],
        threshold: 0.3,
        includeScore: true,
        minMatchCharLength: 1,
      }),
    [products],
  );

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (tag && tag.trim()) {
      filtered = filtered.filter((product) =>
        product.tags?.some(
          (productTag) => productTag.toLowerCase() === tag.toLowerCase(),
        ),
      );
    }

    if (search && search.trim()) {
      const fuse = new Fuse(filtered, {
        keys: [
          { name: "name", weight: 0.5 },
          { name: "tagline", weight: 0.3 },
          { name: "tags", weight: 0.2 },
        ],
        threshold: 0.3,
        includeScore: true,
        minMatchCharLength: 1,
      });
      const results = fuse.search(search.trim());
      return results.map((result) => result.item);
    }

    return filtered;
  }, [products, search, tag]);

  const handleClearSearch = () => {
    setSearch(null);
  };

  const handleClearTag = () => {
    setTag("");
  };

  const handleClearAll = () => {
    setSearch(null);
    setTag("");
  };

  const totalProducts = filteredProducts.length;
  const gridCols = 2;
  const remainder = totalProducts % gridCols;
  const emptyCells = remainder === 0 ? 0 : gridCols - remainder;

  return (
    <div className="p-6 sm:p-8 space-y-8">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h1 className="text-xl font-medium">{category.name}</h1>
          <p className="text-muted-foreground text-sm capitalize">
            Explore {category.name.toLowerCase()} products
          </p>
        </div>

        <Input
          placeholder="Search products..."
          value={search || ""}
          onChange={(e) => setSearch(e.target.value || null)}
          className="max-w-md text-xs"
        />
      </div>

      {tag && (
        <div className="flex flex-wrap items-center gap-2">
          <div className="text-xs text-muted-foreground capitalize">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "product" : "products"}
            {tag && ` with tag "${tag}"`}
            {search && ` matching "${search}"`}
          </div>
          {tag && (
            <Button
              variant="ghost"
              size="xs"
              onClick={handleClearTag}
              className="shrink-0"
            >
              <X className="size-3" />
              Clear tag filter
            </Button>
          )}
        </div>
      )}

      {filteredProducts.length === 0 ? (
        <Alert>
          <AlertDescription className="mx-auto">
            {search || tag
              ? `No products found ${tag ? `with tag "${tag}"` : ""} ${search ? `matching "${search}"` : ""}`
              : "No products found in this category"}
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 border rounded">
          {filteredProducts.map((product, index) => (
            <ProductGridCard
              key={product.id}
              product={product}
              index={index}
              totalProducts={filteredProducts.length}
            />
          ))}

          {Array.from({ length: emptyCells }).map((_, index) => (
            <EmptyGridCell
              key={`empty-${index}`}
              index={index}
              cellIndex={totalProducts + index}
              totalCells={totalProducts + emptyCells}
            />
          ))}
        </div>
      )}
    </div>
  );
}
