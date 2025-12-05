import { createClient } from "@/lib/supabase/server";
import { cache } from "react";
import { Product } from "../types";

export const getAllProducts = cache(async (): Promise<Product[]> => {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("is_featured", { ascending: false })
    .order("likes_count", { ascending: false });

  if (error) {
    return [];
  }

  return products || [];
});

