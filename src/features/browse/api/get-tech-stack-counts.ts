import { createClient } from "@/lib/supabase/server";
import { cache } from "react";

export interface TechStackCount {
  name: string;
  count: number;
}

export const getTechStackCounts = cache(async (): Promise<TechStackCount[]> => {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select("techstack");

  if (error || !products) {
    return [];
  }

  const counts = new Map<string, number>();

  products.forEach((product) => {
    if (product.techstack && Array.isArray(product.techstack)) {
      product.techstack.forEach((tech: string) => {
        if (tech && tech.trim()) {
          const normalized = tech.trim().toLowerCase();
          counts.set(normalized, (counts.get(normalized) || 0) + 1);
        }
      });
    }
  });

  const result: TechStackCount[] = Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return result;
});

