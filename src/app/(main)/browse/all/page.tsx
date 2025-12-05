import { AllProductsContent } from "@/features/browse/components/all-products-content";
import { getAllProducts } from "@/features/products/api/get-all-products";
import type { Metadata } from "next";
import {
  createLoader,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "Browse All Products | saaslist",
  description:
    "Browse all bootstrapped SaaS tools. Search and filter through the complete directory.",
  alternates: {
    canonical: `${baseUrl}/browse/all`,
  },
};

export const revalidate = 600;

const loadSearchParams = createLoader({
  page: parseAsInteger.withDefault(1),
  search: parseAsString.withDefault(""),
  sort: parseAsStringEnum([
    "featured",
    "likes",
    "newest",
    "oldest",
    "name-asc",
    "name-desc",
  ]).withDefault("featured"),
});

export default async function BrowseAllPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { page, search, sort } = await loadSearchParams(searchParams);

  const allProducts = await getAllProducts();

  return (
    <div className="p-4 sm:p-6 w-full">
      <AllProductsContent
        allProducts={allProducts}
        page={page}
        search={search}
        sort={sort}
      />
    </div>
  );
}
