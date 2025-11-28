import { createClient } from "@/lib/supabase/server";
import { cache } from "react";

export interface UpdateWithProduct {
  id: string;
  title: string;
  created_at: string;
  product: {
    id: string;
    name: string;
    logo_url?: string;
    is_featured?: boolean;
  };
  is_featured: boolean;
}

type PartialProduct = {
  id: string;
  name: string;
  logo_url?: string | null;
  is_featured?: boolean | null;
};

type SupabaseUpdate = {
  id: string;
  title: string;
  created_at: string;
  product_id: string;
  products: PartialProduct | null;
};

export const getLatestProductUpdates = cache(async (): Promise<UpdateWithProduct[]> => {
  const supabase = await createClient();

  const { data: updates, error } = await supabase
    .from("product_updates")
    .select(
      `
      id,
      title,
      created_at,
      product_id,
      products!product_updates_product_id_fkey(
        id,
        name,
        logo_url,
        is_featured
      )
    `
    )
    .order("created_at", { ascending: false })
    .limit(10);

  if (error || !updates) return [];

  const processedUpdates: UpdateWithProduct[] = [];
  const featuredProductIds = new Set<string>();

  (updates as unknown as SupabaseUpdate[]).forEach((update, index) => {
    const product = update.products;
    if (!product) return;

    const shouldBeFeatured =
      (index + 1) % 3 === 0 &&
      !featuredProductIds.has(product.id) &&
      !product.is_featured;

    if (shouldBeFeatured) {
      featuredProductIds.add(product.id);
    }

    processedUpdates.push({
      id: update.id,
      title: update.title,
      created_at: update.created_at,
      product: {
        id: product.id,
        name: product.name,
        logo_url: product.logo_url ?? undefined,
        is_featured: product.is_featured || shouldBeFeatured,
      },
      is_featured: product.is_featured || shouldBeFeatured,
    });
  });

  return processedUpdates;
});

