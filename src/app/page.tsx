import Footer from "@/components/footer";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import LatestProductUpdates from "@/features/products/components/latest-product-updates";
import { ProductDiscoverySection } from "@/features/products/components/product-discovery-section";
import ProductList from "@/features/products/components/product-list";
import ProductsLogoCloud from "@/features/products/components/products-logo-cloud";
import ProductListSkeleton from "@/features/products/components/skeletons/product-list-skeleton";
import LatestProductUpdatesSkeleton from "@/features/products/components/skeletons/product-updates-skeleton";
import ProductsLogoCloudSkeleton from "@/features/products/components/skeletons/products-marquee-skeleton";
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
    <div className="min-h-screen max-w-6xl relative space-y-8 mx-auto">
      <Header containerClassName="max-w-6xl" />

      <div className="w-full max-w-6xl mx-auto py-12 text-center flex-col md:px-6 flex items-center md:items-center justify-start gap-8 overflow-hidden relative">
        <Link
          href={"#"}
          className="leading-snug text-sm font-medium tracking-tight capitalize flex items-center gap-x-2 dark:bg-background dark:border dark:border-violet-50/50 dark:hover:border-violet-50 transition-all duration-200 rounded px-2 py-0.5 dark:shadow-violet-50/10 dark:shadow-xl"
        >
          Join our affiliate program
        </Link>
        <div className="space-y-4 relative">
          <h1 className="text-5xl sm:text-6xl xl:text-7xl leading-tight font-mono font-extralight tracking-tighter xl:leading-tight text-balance">
            Get Noticed. Get Users. Get Results.
          </h1>
          <p className="text-muted-foreground text-sm md:text-base text-balance">
            Showcase your SaaS product to thousands of early adopters,
            entrepreneurs, and tech enthusiasts.
          </p>
        </div>
        <div className="space-y-4 relative z-10">
          <div className="space-x-2">
            <Button
              asChild
              size={"lg"}
              className="rounded-xl active:scale-98 border-primary bg-primary/75 text-primary-foreground hover:bg-primary/85 dark:bg-primary/90 dark:border-primary dark:hover:bg-primary border border-b-2 shadow-md shadow-zinc-950/20 ring ring-inset ring-white/15 transition-[filter,scale,background] duration-200 hover:brightness-110 dark:ring-transparent"
            >
              <Link href={"/products/new"}>Submit your SaaS</Link>
            </Button>
            <Button
              asChild
              variant={"secondary"}
              size={"lg"}
              className="bg-muted hover:bg-background dark:bg-muted/25 dark:hover:bg-muted/50 dark:border-border inset-shadow-2xs inset-shadow-white dark:inset-shadow-transparent border border-zinc-300 shadow-sm shadow-zinc-950/10 ring-0 duration-150"
            >
              <Link href={"/browse"}>Browse Products</Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Free to submit • No credit card required • No waitlist
          </p>
        </div>
      </div>

      <Suspense fallback={<ProductsLogoCloudSkeleton />}>
        <ProductsLogoCloud />
      </Suspense>

      <main className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 flex flex-col gap-8">
            <Suspense
              fallback={
                <div className="space-y-8">
                  <div className="space-y-6">
                    <Skeleton className="h-7 w-48 rounded" />
                    <ProductListSkeleton count={10} />
                  </div>
                  <div className="space-y-6">
                    <Skeleton className="h-7 w-48 rounded" />
                    <ProductListSkeleton count={10} />
                  </div>
                  <div className="space-y-6">
                    <Skeleton className="h-7 w-48 rounded" />
                    <ProductListSkeleton count={10} />
                  </div>
                  <div className="space-y-6">
                    <Skeleton className="h-7 w-48 rounded" />
                    <ProductListSkeleton count={10} />
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
          <div className="lg:w-80 lg:shrink-0 space-y-8">
            <Suspense fallback={<LatestProductUpdatesSkeleton />}>
              <ProductDiscoverySection />
            </Suspense>
            <Suspense fallback={<LatestProductUpdatesSkeleton />}>
              <LatestProductUpdates />
            </Suspense>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
