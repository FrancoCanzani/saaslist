"use client";

import { Product } from "@/features/products/types";
import { TagCategory } from "@/utils/constants";
import { useQueryState } from "nuqs";
import { useMemo } from "react";
import ProductCard from "@/features/products/components/product-card";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Fuse from "fuse.js";

interface CategoryProductsProps {
  category: TagCategory;
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
    [products]
  );

  const filteredProducts = useMemo(() => {
    if (!search || !search.trim()) {
      return products;
    }

    const results = fuse.search(search.trim());
    return results.map((result) => result.item);
  }, [products, search, fuse]);

  const handleClearSearch = () => {
    setSearch(null);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
        <p className="text-muted-foreground text-sm mb-6">
          Explore {category.name.toLowerCase()} products
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Input
              placeholder="Search products..."
              value={search || ""}
              onChange={(e) => setSearch(e.target.value || null)}
              className="w-full"
            />
          </div>
          {search && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearSearch}
              className="shrink-0"
            >
              <X className="size-4 mr-2" />
              Clear search
            </Button>
          )}
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          {filteredProducts.length}{" "}
          {filteredProducts.length === 1 ? "product" : "products"}
          {search && ` matching "${search}"`}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="border-dashed border p-8 rounded-xl text-muted-foreground text-center">
          {search
            ? `No products found matching "${search}"`
            : "No products found in this category"}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

