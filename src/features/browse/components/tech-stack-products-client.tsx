"use client";

import { useState, useMemo } from "react";
import ProductCard from "@/features/products/components/product-card";
import { Input } from "@/components/ui/input";
import { ProductSortSelect, type SortOption } from "./product-sort-select";
import { Search } from "lucide-react";
import { Product } from "@/features/products/types";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { parseAsInteger, parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";
import Fuse from "fuse.js";


interface TechStackProductsClientProps {
  techName: string;
  allProducts: Product[];
  page: number;
  search: string;
  sort: SortOption;
}

const PRODUCTS_PER_PAGE = 50;

export function TechStackProductsClient({
  techName,
  allProducts,
  page: initialPage,
  search: initialSearch,
  sort: initialSort,
}: TechStackProductsClientProps) {
  const [searchParams, setSearchParams] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    search: parseAsString.withDefault(""),
    sort: parseAsStringEnum(["featured", "likes", "newest", "oldest", "name-asc", "name-desc"]).withDefault("featured"),
  });

  const [searchInput, setSearchInput] = useState(initialSearch);

  const fuse = useMemo(
    () =>
      new Fuse(allProducts, {
        keys: [
          { name: "name", weight: 0.5 },
          { name: "tagline", weight: 0.3 },
          { name: "tags", weight: 0.2 },
        ],
        threshold: 0.3,
        includeScore: true,
        minMatchCharLength: 1,
      }),
    [allProducts],
  );

  const filteredAndSortedProducts = useMemo(() => {
    let products = allProducts;

    if (searchParams.search && searchParams.search.trim()) {
      const results = fuse.search(searchParams.search.trim());
      products = results.map((result) => result.item);
    }

    switch (searchParams.sort) {
      case "featured":
        products = [...products].sort((a, b) => {
          if (a.is_featured && !b.is_featured) return -1;
          if (!a.is_featured && b.is_featured) return 1;
          return b.likes_count - a.likes_count;
        });
        break;
      case "likes":
        products = [...products].sort((a, b) => b.likes_count - a.likes_count);
        break;
      case "newest":
        products = [...products].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
        break;
      case "oldest":
        products = [...products].sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        );
        break;
      case "name-asc":
        products = [...products].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        products = [...products].sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    return products;
  }, [allProducts, searchParams.search, searchParams.sort, fuse]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (searchParams.page - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredAndSortedProducts.slice(startIndex, endIndex);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    setSearchParams({
      search: value || null,
      page: 1,
    });
  };

  const handleSortChange = (value: string) => {
    setSearchParams({
      sort: value as SortOption,
      page: 1,
    });
  };

  const createPageUrl = (newPage: number) => {
    const params = new URLSearchParams();
    if (searchParams.search) params.set("search", searchParams.search);
    if (searchParams.sort !== "featured") params.set("sort", searchParams.sort);
    if (newPage > 1) params.set("page", newPage.toString());
    const queryString = params.toString();
    return `/browse/tech-stacks/${encodeURIComponent(techName)}${queryString ? `?${queryString}` : ""}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-medium mb-2">Products using {techName}</h1>
        <p className="text-muted-foreground text-sm">
          {filteredAndSortedProducts.length} product{filteredAndSortedProducts.length !== 1 ? "s" : ""} found
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <ProductSortSelect
          value={searchParams.sort}
          onValueChange={handleSortChange}
        />
      </div>

      {paginatedProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  {searchParams.page > 1 ? (
                    <PaginationPrevious href={createPageUrl(searchParams.page - 1)} />
                  ) : (
                    <PaginationPrevious className="pointer-events-none opacity-50" />
                  )}
                </PaginationItem>
                {(() => {
                  const pages: (number | string)[] = [];
                  const maxVisible = 7;
                  let start = Math.max(1, searchParams.page - Math.floor(maxVisible / 2));
                  let end = Math.min(totalPages, start + maxVisible - 1);
                  if (end - start < maxVisible - 1) {
                    start = Math.max(1, end - maxVisible + 1);
                  }

                  if (start > 1) {
                    pages.push(1);
                    if (start > 2) pages.push("ellipsis-start");
                  }

                  for (let i = start; i <= end; i++) {
                    pages.push(i);
                  }

                  if (end < totalPages) {
                    if (end < totalPages - 1) pages.push("ellipsis-end");
                    pages.push(totalPages);
                  }

                  return pages.map((pageNum, idx) => {
                    if (pageNum === "ellipsis-start" || pageNum === "ellipsis-end") {
                      return (
                        <PaginationItem key={`ellipsis-${idx}`}>
                          <span className="flex size-9 items-center justify-center">
                            ...
                          </span>
                        </PaginationItem>
                      );
                    }
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          href={createPageUrl(pageNum as number)}
                          isActive={pageNum === searchParams.page}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  });
                })()}
                <PaginationItem>
                  {searchParams.page < totalPages ? (
                    <PaginationNext href={createPageUrl(searchParams.page + 1)} />
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
