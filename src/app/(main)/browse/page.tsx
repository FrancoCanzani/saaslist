import { getAllCategoriesWithProducts } from "@/features/browse/api/get-all-categories-with-products";
import { BrowseContent } from "@/features/browse/components/browse-content";
import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "Browse Bootstrapped SaaS Tools | saaslist",
  description:
    "Browse curated bootstrapped SaaS tools by category. Discover founder-built software without external funding.",
  alternates: {
    canonical: `${baseUrl}/browse`,
  },
};

export const revalidate = 600;

export default async function BrowsePage() {
  const categories = await getAllCategoriesWithProducts();

  return <BrowseContent categories={categories} />;
}
