import { createClient } from "@/lib/supabase/server";
import { cache } from "react";
import { Product } from "../types";

export const getProducts = cache(async (): Promise<{ products: Product[] }> => {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(50);

  return { products: products || [] };
});
