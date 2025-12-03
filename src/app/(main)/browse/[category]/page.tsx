import { getCategoryProducts } from "@/features/browse/api/get-category-products";
import { CategoryContent } from "@/features/browse/components/category-content";
import { categories } from "@/utils/constants/categories";
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
    return { title: "Category Not Found | saaslist" };
  }

  const products = await getCategoryProducts(category.tags);
  const productCount = products.length;
  const description = `Browse curated bootstrapped SaaS tools in the ${category.name} category. Founder-built software without external funding.`;

  return {
    title: `${category.name} Bootstrapped SaaS Tools | saaslist`,
    description,
    alternates: {
      canonical: `${baseUrl}/browse/${categorySlug}`,
    },
    openGraph: {
      title: `${category.name} Bootstrapped SaaS Tools`,
      description,
      type: "website",
      url: `${baseUrl}/browse/${categorySlug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.name} Bootstrapped SaaS Tools`,
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
