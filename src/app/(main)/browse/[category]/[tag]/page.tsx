import ProductCard from "@/features/products/components/product-card";
import { Product } from "@/features/products/types";
import { createClient } from "@/lib/supabase/server";
import { categories } from "@/utils/constants";
import { getCategoryBySlug, getTagSlug } from "@/utils/helpers";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 600;

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function generateStaticParams() {
  const params: { category: string; tag: string }[] = [];

  categories.forEach((category) => {
    category.tags.forEach((tag) => {
      params.push({
        category: category.slug,
        tag: getTagSlug(tag),
      });
    });
  });

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; tag: string }>;
}): Promise<Metadata> {
  const { category: categorySlug, tag: tagSlug } = await params;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    return {
      title: "Tag Not Found | SaasList",
    };
  }

  const tag = category.tags.find((t) => getTagSlug(t) === tagSlug);

  if (!tag) {
    return {
      title: "Tag Not Found | SaasList",
    };
  }

  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("id")
    .contains("tags", [tag])
    .order("created_at", { ascending: false });

  const productCount = products?.length || 0;
  const description = `Discover ${productCount} ${productCount === 1 ? "SaaS tool" : "SaaS tools"} tagged with ${tag}. Browse ${tag} products in ${category.name} on SaasList.`;

  return {
    title: `${tag} SaaS Tools | SaasList`,
    description,
    alternates: {
      canonical: `${baseUrl}/browse/${categorySlug}/${tagSlug}`,
    },
    openGraph: {
      title: `${tag} SaaS Tools`,
      description,
      type: "website",
      url: `${baseUrl}/browse/${categorySlug}/${tagSlug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${tag} SaaS Tools`,
      description,
    },
  };
}

export default async function CategoryTagPage({
  params,
}: {
  params: Promise<{ category: string; tag: string }>;
}) {
  const { category: categorySlug, tag: tagSlug } = await params;

  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  const tag = category.tags.find((t) => getTagSlug(t) === tagSlug);

  if (!tag) {
    notFound();
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: products, error } = await supabase
    .from("products")
    .select(
      `
      *,
      likes!left(user_id)
    `,
    )
    .contains("tags", [tag])
    .order("created_at", { ascending: false });

  const processedProducts = (products || []).map((product: any) => {
    const { likes_count, ...rest } = product;
    return {
      ...rest,
      likes_count,
      is_liked: user
        ? product.likes?.some((like: any) => like.user_id === user.id)
        : false,
    };
  }) as Product[];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 w-full">
      <div className="flex items-center w-full justify-between gap-6">
        <div>
          <h1 className="text-xl font-medium">
            {category.name} / {tag}
          </h1>
        </div>

        <div className="text-xs text-muted-foreground">
          {processedProducts.length}{" "}
          {processedProducts.length === 1 ? "product" : "products"}
        </div>
      </div>

      {processedProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-sm">
            No products found with this tag yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4 flex flex-col">
          {processedProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              position={index + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
