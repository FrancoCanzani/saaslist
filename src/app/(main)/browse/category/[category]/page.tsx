import { CategoryProductsContent } from "@/features/browse/components/category-products-content";
import { categories } from "@/utils/constants/categories";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryProducts } from "@/features/browse/api/get-category-products";
import { createLoader, parseAsInteger, parseAsString, parseAsStringEnum } from "nuqs/server";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const categoryData = categories.find((cat) => cat.slug === category);

  if (!categoryData) {
    return {
      title: "Category Not Found | saaslist",
    };
  }

  return {
    title: `${categoryData.name} Products | saaslist`,
    description:
      categoryData.description || `Browse ${categoryData.name} products`,
    alternates: {
      canonical: `${baseUrl}/browse/category/${category}`,
    },
  };
}

const loadSearchParams = createLoader({
  page: parseAsInteger.withDefault(1),
  search: parseAsString.withDefault(""),
  sort: parseAsStringEnum(["featured", "likes", "newest", "oldest", "name-asc", "name-desc"]).withDefault("featured"),
  tag: parseAsString.withDefault(""),
});

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { category } = await params;
  const categoryData = categories.find((cat) => cat.slug === category);

  if (!categoryData) {
    notFound();
  }

  const { page, search, sort, tag } = await loadSearchParams(searchParams);

  const allProducts = await getCategoryProducts(categoryData.tags);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <CategoryProductsContent
        category={categoryData}
        allProducts={allProducts}
        page={page}
        search={search}
        sort={sort}
        tag={tag}
      />
    </div>
  );
}
