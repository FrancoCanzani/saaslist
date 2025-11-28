import { createClient } from "@/lib/supabase/server";
import { cache } from "react";
import { Product } from "../types";

export const getProductById = cache(async (id: string): Promise<Product | null> => {
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !product) {
    return null;
  }

  return product as Product;
});

