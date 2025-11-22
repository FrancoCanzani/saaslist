"use client";

import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Product } from "../types";
import { ProductDiscoveryCard } from "./product-discovery-card";

interface DiscoverItem {
  type: "normal" | "featured";
  id: string;
  name: string;
  tagline: string | null;
  logo_url: string | null;
  images: string[] | null;
  is_featured: boolean | null;
  user_id: string;
  created_at: string;
  [key: string]: unknown;
}

interface DiscoverResponse {
  items: DiscoverItem[];
  nextPage: number | null;
  hasMore: boolean;
}

async function fetchDiscoverPage(
  page: number,
  seenIds: string[],
): Promise<DiscoverResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
  });

  if (seenIds.length > 0) {
    params.append("seen", seenIds.join(","));
  }

  const response = await fetch(`/api/products/discover?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
}

export function ProductDiscoverySection() {
  const queryClient = useQueryClient();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [seenIds, setSeenIds] = useState<string[]>([]);
  const seenIdsRef = useRef<Set<string>>(new Set());
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id || null);
    });
  }, []);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["discover-products", userId],
      queryFn: ({ pageParam = 1 }) => fetchDiscoverPage(pageParam, seenIds),
      getNextPageParam: (lastPage) => lastPage.nextPage,
      initialPageParam: 1,
    });

  const allProducts = data?.pages.flatMap((page) => page.items) || [];

  useEffect(() => {
    const remaining = allProducts.length - currentIndex;
    if (remaining < 3 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [
    currentIndex,
    allProducts.length,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  ]);

  useEffect(() => {
    if (allProducts[currentIndex + 1]) {
      const nextProduct = allProducts[currentIndex + 1];
      queryClient.prefetchQuery({
        queryKey: ["product", nextProduct.id],
        queryFn: async () => {
          const response = await fetch(`/api/products/${nextProduct.id}`);
          if (!response.ok) throw new Error("Failed to fetch product");
          const data = await response.json();
          return data.data;
        },
      });
    }
  }, [currentIndex, allProducts, queryClient]);

  const handleSwipe = (productId: string, action: "like" | "skip") => {
    // Add to seen set
    seenIdsRef.current.add(productId);
    setSeenIds(Array.from(seenIdsRef.current));

    // Move to next product
    if (currentIndex < allProducts.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 hidden lg:block">
        <h2 className="text-xl leading-tight font-medium">
          Discover New Products
        </h2>
        <Card className="p-8 text-center text-muted-foreground">
          <p>Loading products...</p>
        </Card>
      </div>
    );
  }

  if (allProducts.length === 0 || currentIndex >= allProducts.length) {
    return (
      <div className="space-y-6 hidden lg:block">
        <h2 className="text-xl leading-tight font-medium">
          Discover New Products
        </h2>
        <Card className="p-8 text-center text-xs text-balance text-muted-foreground">
          <p>No more products to show. Check back later!</p>
        </Card>
      </div>
    );
  }

  const currentItem = allProducts[currentIndex];
  const currentProduct: Product = {
    id: currentItem.id,
    name: currentItem.name,
    tagline: currentItem.tagline || "",
    description: "",
    website_url: "",
    pricing_model: "free",
    tags: [],
    platforms: [],
    user_id: currentItem.user_id,
    likes_count: 0,
    comments_count: 0,
    reviews_count: 0,
    logo_url: currentItem.logo_url || undefined,
    images: currentItem.images || undefined,
    is_featured: currentItem.is_featured || false,
    created_at: currentItem.created_at,
    updated_at: currentItem.created_at,
  };

  return (
    <div className="space-y-6 hidden lg:block">
      <h2 className="text-xl leading-tight font-medium">
        Discover New Products
      </h2>
      <ProductDiscoveryCard
        product={currentProduct}
        onSwipe={handleSwipe}
        isFeatured={currentItem.type === "featured"}
      />
    </div>
  );
}
