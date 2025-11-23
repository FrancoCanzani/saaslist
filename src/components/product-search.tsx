"use client";

import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDebounce } from "use-debounce";
import { Product } from "@/features/products/types";
import { useState } from "react";
import Link from "next/link";
import ProductLogo from "@/features/products/components/product-logo";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

async function searchProducts(query: string): Promise<Product[]> {
  if (!query.trim()) return [];
  const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
  const data = await response.json();
  return data.products || [];
}

export function ProductSearchDialog() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);

  const { data: results = [], isLoading } = useQuery({
    queryKey: ["product-search", debouncedSearch],
    queryFn: () => searchProducts(debouncedSearch),
    enabled: debouncedSearch.trim().length > 0 && open,
  });

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setSearch("");
    }
  };

  return (
    <>
      <Button
        variant="secondary"
        size="xs"
        onClick={() => setOpen(true)}
        className="gap-2"
      >
        Search
      </Button>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Search Products</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <form className="relative">
              <Input
                type="search"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </form>

            {(results.length > 0 || isLoading || debouncedSearch) && (
              <div className="border rounded-xl max-h-96 overflow-y-auto">
                {isLoading ? (
                  <div className="p-2 text-xs text-muted-foreground text-center">
                    Searching...
                  </div>
                ) : results.length > 0 ? (
                  <div className="divide-y">
                    {results.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.id}`}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        <ProductLogo
                          logoUrl={product.logo_url}
                          productName={product.name}
                          size={30}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">
                            {product.name}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {product.tagline}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : debouncedSearch.trim() ? (
                  <div className="p-2 text-xs text-muted-foreground text-center">
                    No products found
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
