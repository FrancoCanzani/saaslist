import ProductGrid from "@/features/products/components/product-grid";
import { Product } from "@/features/products/types";
import { categories } from "@/utils/constants";
import { getCategoryBySlug } from "@/utils/helpers";
import { createClient } from "@/utils/supabase/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 600;

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function generateStaticParams() {
  return categories.map((category) => ({
    category: category.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    return {
      title: "Category Not Found | SaasList",
    };
  }

  const supabase = await createClient();
  const categoryTagsLower = category.tags.map((tag) => tag.toLowerCase());

  const { data: products } = await supabase
    .from("products")
    .select("id")
    .order("created_at", { ascending: false });

  const categoryProducts = (products || []).filter((product: any) => {
    if (!product.tags || !Array.isArray(product.tags)) return false;
    return product.tags.some((tag: string) =>
      categoryTagsLower.includes(tag.toLowerCase()),
    );
  });

  const productCount = categoryProducts.length;
  const description = `${category.description} Discover ${productCount} ${productCount === 1 ? "product" : "products"} in ${category.name} on SaasList.`;

  return {
    title: `Best ${category.name} SaaS Products | SaasList`,
    description,
    alternates: {
      canonical: `${baseUrl}/browse/${categorySlug}`,
    },
    openGraph: {
      title: `Best ${category.name} SaaS Products`,
      description,
      type: "website",
      url: `${baseUrl}/browse/${categorySlug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `Best ${category.name} SaaS Products`,
      description,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = await params;

  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const categoryTagsLower = category.tags.map((tag) => tag.toLowerCase());

  const { data: products, error } = await supabase
    .from("products")
    .select(
      `
      *,
      likes!left(user_id)
    `,
    )
    .order("created_at", { ascending: false });

  const categoryProducts = (products || [])
    .filter((product: any) => {
      if (!product.tags || !Array.isArray(product.tags)) return false;
      return product.tags.some((tag: string) =>
        categoryTagsLower.includes(tag.toLowerCase()),
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
    }) as Product[];

  const tagCounts = new Map<string, number>();
  category.tags.forEach((tag) => {
    const count = categoryProducts.filter((product) =>
      product.tags?.some((t) => t.toLowerCase() === tag.toLowerCase()),
    ).length;
    if (count > 0) {
      tagCounts.set(tag, count);
    }
  });

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8 space-y-8">
        <div className="flex items-center w-full justify-between gap-6">
          <div>
            <h1 className="text-xl font-medium">{category.name}</h1>
            {category.description && (
              <h2 className="text-muted-foreground text-sm">
                {category.description}
              </h2>
            )}
          </div>

          <div className="text-xs text-muted-foreground">
            {categoryProducts.length}{" "}
            {categoryProducts.length === 1 ? "product" : "products"}
          </div>
        </div>

        {categoryProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-sm">
              No products in this category yet.
            </p>
          </div>
        ) : (
          <ProductGrid products={categoryProducts} />
        )}
      </div>
    </>
  );
}
