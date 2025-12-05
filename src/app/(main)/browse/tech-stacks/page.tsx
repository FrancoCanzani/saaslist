import { getTechStackCounts } from "@/features/browse/api/get-tech-stack-counts";
import { TechStacksContent } from "@/features/browse/components/tech-stacks-content";
import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "Browse by Tech Stacks | saaslist",
  description:
    "Browse bootstrapped SaaS tools by technology stack. Discover products built with specific technologies.",
  alternates: {
    canonical: `${baseUrl}/browse/tech-stacks`,
  },
};

export const revalidate = 600;

export default async function BrowseTechStacksPage() {
  const techStackCounts = await getTechStackCounts();

  return (
    <div className="p-4 sm:p-6 ">
      <TechStacksContent techStackCounts={techStackCounts} />
    </div>
  );
}
