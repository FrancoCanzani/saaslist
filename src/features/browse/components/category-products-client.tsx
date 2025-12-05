"use client";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductCard from "@/features/products/components/product-card";
import { Product } from "@/features/products/types";
import { Category } from "@/utils/types";
import { Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type SortOption = "featured" | "likes" | "newest" | "oldest";

interface CategoryProductsClientProps {
  category: Category;
  products: Product[];
  totalCount: number;
  totalPages: number;
  page: number;
  search: string;
  sort: SortOption;
  tag?: string;
}

export function CategoryProductsClient({
  category,
  products,
  totalCount,
  totalPages,
  page,
  search: initialSearch,
  sort: initialSort,
  tag: initialTag,
}: CategoryProductsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(initialSearch);

  const updateSearchParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    params.set("page", "1");
    router.push(`/browse/category/${category.slug}?${params.toString()}`);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (value.trim()) {
      updateSearchParams({ search: value });
    } else {
      updateSearchParams({ search: null });
    }
  };

  const handleSortChange = (value: string) => {
    updateSearchParams({ sort: value });
  };

  const handleTagClick = (tag: string) => {
    const newTag = initialTag === tag ? null : tag;
    updateSearchParams({ tag: newTag });
  };

  const createPageUrl = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    return `/browse/category/${category.slug}?${params.toString()}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-medium mb-2">{category.name}</h1>
        {category.description && (
          <p className="text-muted-foreground text-sm">
            {category.description}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {category.tags.map((categoryTag) => (
          <Badge
            key={categoryTag}
            variant={initialTag === categoryTag ? "default" : "secondary"}
            className="cursor-pointer"
            onClick={() => handleTagClick(categoryTag)}
          >
            {categoryTag}
            {initialTag === categoryTag && (
              <X
                className="ml-1 size-3"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTagClick(categoryTag);
                }}
              />
            )}
          </Badge>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={initialSort} onValueChange={handleSortChange}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured First</SelectItem>
            <SelectItem value="likes">Most Liked</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  {page > 1 ? (
                    <PaginationPrevious>
                      <Link href={createPageUrl(page - 1)} />
                    </PaginationPrevious>
                  ) : (
                    <PaginationPrevious className="pointer-events-none opacity-50" />
                  )}
                </PaginationItem>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink isActive={pageNum === page}>
                        <Link href={createPageUrl(pageNum)}>{pageNum}</Link>
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                <PaginationItem>
                  {page < totalPages ? (
                    <PaginationNext>
                      <Link href={createPageUrl(page + 1)} />
                    </PaginationNext>
                  ) : (
                    <PaginationNext className="pointer-events-none opacity-50" />
                  )}
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
}
