import { createClient } from "@/lib/supabase/server";
import { cache } from "react";

export const getProductTags = cache(async () => {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select("id, tags")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching product tags:", error);
    return [];
  }

  return products || [];
});