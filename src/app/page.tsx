import Footer from "@/components/footer";
import Header from "@/components/header";
import ProductGridSkeleton from "@/components/skeletons/product-grid-skeleton";
import ProductsMarqueeSkeleton from "@/components/skeletons/products-marquee-skeleton";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import LatestFounderUpdates from "@/features/products/components/latest-founder-updates";
import ProductList from "@/features/products/components/product-list";
import ProductsMarquee from "@/features/products/components/products-marquee";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "SaasList - Discover & Share the Best SaaS Products",
  description:
    "Discover and share the best SaaS products. Browse thousands of tools, read reviews, and find your next favorite software on SaasList.",
  alternates: {
    canonical: baseUrl,
  },
};

export const revalidate = 600;

export default async function Home() {
  return (
    <div className="min-h-screen max-w-7xl relative space-y-8 mx-auto">
      <Header />

      <div className="w-full max-w-6xl mx-auto py-12 text-start md:text-center flex-col px-6 flex items-start md:items-center justify-start gap-8 overflow-hidden relative">
        <Link
          href={"#"}
          className="leading-snug text-sm font-medium tracking-tight capitalize flex items-center gap-x-2 bg-violet-50 dark:bg-background dark:border dark:border-violet-50/50 dark:hover:border-violet-50 transition-all duration-200 rounded px-2 py-0.5 dark:shadow-violet-50/10 dark:shadow-xl"
        >
          Join our affiliate program
        </Link>
        <div className="space-y-4 relative">
          <h1 className="text-5xl sm:text-6xl xl:text-7xl leading-tight font-mono font-extralight tracking-tighter xl:leading-tight text-balance relative z-10">
            Get Noticed. Get Users. Get Results.
          </h1>
          <p className="text-muted-foreground text-sm md:text-base text-balance relative z-10">
            Showcase your SaaS product to thousands of early adopters,
            entrepreneurs, and tech enthusiasts.
          </p>
        </div>
        <div className="space-y-4 relative z-10">
          <div className="space-x-2">
            <Button
              asChild
              variant={"secondary"}
              size={"lg"}
              className="bg-violet-50 rounded-xl dark:bg-[#02010a] hover:bg-violet-100"
            >
              <Link href={"/products/new"}>Submit your SaaS</Link>
            </Button>
            <Button asChild variant={"secondary"} size={"lg"}>
              <Link href={"/browse"}>Browse Products</Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Free to submit • No credit card required • No waitlist
          </p>
        </div>
      </div>

      <Suspense fallback={<ProductsMarqueeSkeleton />}>
        <ProductsMarquee />
      </Suspense>

      <main className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 flex flex-col gap-8">
            <Suspense
              fallback={
                <div className="space-y-8">
                  <div className="space-y-6">
                    <Skeleton className="h-7 w-48 rounded" />
                    <ProductGridSkeleton count={10} />
                  </div>
                  <div className="space-y-6">
                    <Skeleton className="h-7 w-48 rounded" />
                    <ProductGridSkeleton count={10} />
                  </div>
                  <div className="space-y-6">
                    <Skeleton className="h-7 w-48 rounded" />
                    <ProductGridSkeleton count={10} />
                  </div>
                  <div className="space-y-6">
                    <Skeleton className="h-7 w-48 rounded" />
                    <ProductGridSkeleton count={10} />
                  </div>
                </div>
              }
            >
              <ProductList date="today" />
              <ProductList date="yesterday" />
              <ProductList date="week" />
              <ProductList date="month" />
            </Suspense>
          </div>
          <div className="lg:w-80 lg:shrink-0">
            <LatestFounderUpdates />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
