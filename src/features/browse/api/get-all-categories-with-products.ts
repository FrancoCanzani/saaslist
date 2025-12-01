import { createClient } from "@/lib/supabase/server";
import { Product } from "@/features/products/types";
import { categories } from "@/utils/constants/categories";
import { cache } from "react";

interface CategoryWithProducts {
  name: string;
  slug: string;
  description?: string;
  tags: string[];
  products: Product[];
  totalCount: number;
}

export const getAllCategoriesWithProducts = cache(
  async (): Promise<CategoryWithProducts[]> => {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: allProducts, error } = await supabase
      .from("products")
      .select(`*, likes!left(user_id)`)
      .order("is_featured", { ascending: false })
      .order("likes_count", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
      return [];
    }

    return categories.map((category) => {
      const categoryTagsLower = category.tags.map((t) => t.toLowerCase());

      const categoryProducts = (allProducts || [])
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

      return {
        name: category.name,
        slug: category.slug,
        description: category.description,
        tags: category.tags,
        products: categoryProducts.slice(0, 5),
        totalCount: categoryProducts.length,
      };
    });
  }
);

