import { CategoriesContent } from "@/features/browse/components/categories-content";
import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "Browse by Categories | saaslist",
  description:
    "Browse bootstrapped SaaS tools by category. Explore products organized by tags and categories.",
  alternates: {
    canonical: `${baseUrl}/browse/categories`,
  },
};

export default function BrowseCategoriesPage() {
  return (
    <div className="p-4 sm:p-6 ">
      <CategoriesContent />
    </div>
  );
}
