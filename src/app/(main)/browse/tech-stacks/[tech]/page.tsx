import { getProductsByTechStack } from "@/features/browse/api/get-products-by-tech-stack";
import { TechStackProductsClient } from "@/features/browse/components/tech-stack-products-client";
import { getTechItem } from "@/utils/constants/tech-stack";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  createLoader,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tech: string }>;
}): Promise<Metadata> {
  const { tech } = await params;
  const techName = decodeURIComponent(tech);

  return {
    title: `${techName} Products | saaslist`,
    description: `Browse products built with ${techName}`,
    alternates: {
      canonical: `${baseUrl}/browse/tech-stacks/${tech}`,
    },
  };
}

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

export default async function TechStackPage({
  params,
  searchParams,
}: {
  params: Promise<{ tech: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { tech } = await params;
  const techName = decodeURIComponent(tech);
  const { page, search, sort } = await loadSearchParams(searchParams);

  const techItem = getTechItem(techName);
  if (!techItem) {
    notFound();
  }

  const allProducts = await getProductsByTechStack(techName);

  return (
    <div className="p-4 sm:p-6 ">
      <TechStackProductsClient
        techName={techName}
        allProducts={allProducts}
        page={page}
        search={search}
        sort={sort}
      />
    </div>
  );
}
