import { createClient } from "@/lib/supabase/server";
import { cache } from "react";
import { Product } from "@/features/products/types";

export const getProductsByTechStack = cache(
  async (techStack: string): Promise<Product[]> => {
    const supabase = await createClient();

    const { data: products, error } = await supabase
      .from("products")
      .select("*")
      .order("is_featured", { ascending: false })
      .order("likes_count", { ascending: false });

    if (error || !products) {
      return [];
    }

    const normalizedTechStack = techStack.toLowerCase().trim();
    const filtered = products.filter((product) => {
      if (!product.techstack || !Array.isArray(product.techstack)) {
        return false;
      }
      return product.techstack.some(
        (tech: string) => tech?.toLowerCase().trim() === normalizedTechStack,
      );
    });

    return filtered;
  },
);

