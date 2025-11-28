import { createClient } from "@/lib/supabase/server";
import { cache } from "react";
import { Product } from "../types";

export const getFeaturedProducts = cache(async (): Promise<Product[]> => {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_featured", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }

  return (products as Product[]) || [];
});

