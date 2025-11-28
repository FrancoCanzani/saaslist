import { getCategoryProducts } from "@/features/browse/api/get-category-products";
import { CategoryContent } from "@/features/browse/components/category-content";
import { categories } from "@/utils/constants";
import { getCategoryBySlug } from "@/utils/helpers";
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
    return { title: "Category Not Found | SaasList" };
  }

  const products = await getCategoryProducts(category.tags);
  const productCount = products.length;
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

  const products = await getCategoryProducts(category.tags);

  return <CategoryContent category={category} products={products} />;
}
