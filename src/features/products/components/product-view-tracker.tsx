"use client";

import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";

const trackProductView = async (productId: string) => {
  const response = await fetch(`/api/products/${productId}/view`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to track view");
  }

  return response.json();
};

export function ProductViewTracker({ productId }: { productId: string }) {
  const pathname = usePathname();
  const [debounced] = useDebounce(productId, 1000);

  const { mutate } = useMutation({
    mutationFn: trackProductView,
    onError: (err) => console.error("Failed to track view:", err),
  });

  useEffect(() => {
    if (pathname?.startsWith("/products/") && debounced) {
      mutate(debounced);
    }
  }, [pathname, debounced, mutate]);

  return null;
}

