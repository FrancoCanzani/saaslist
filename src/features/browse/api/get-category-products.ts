import { createClient } from "@/lib/supabase/server";
import { Product } from "@/features/products/types";
import { cache } from "react";

export const getCategoryProducts = cache(
  async (categoryTags: string[]): Promise<Product[]> => {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const categoryTagsLower = categoryTags.map((tag) => tag.toLowerCase());

    const { data: products, error } = await supabase
      .from("products")
      .select(`*, likes!left(user_id)`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching category products:", error);
      return [];
    }

    return (products || [])
      .filter((product: any) => {
        if (!product.tags || !Array.isArray(product.tags)) return false;
        return product.tags.some((tag: string) =>
          categoryTagsLower.includes(tag.toLowerCase())
        );
      })
      .map((product: any) => {
        const { likes_count, ...rest } = product;
        return {
          ...rest,
          likes_count,
          is_liked: user
            ? product.likes?.some((like: any) => like.user_id === user.id)
            : false,
        };
      });
  }
);

