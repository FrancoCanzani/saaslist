import Footer from "@/components/footer";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import ProductGrid from "@/features/products/components/product-grid";
import ProductGridSkeleton from "@/features/products/components/skeletons/product-grid-skeleton";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "saaslist - A curated directory of bootstrapped SaaS tools",
  description:
    "A curated directory bootstrapped SaaS tools built by independent founders and small teams.",
  alternates: {
    canonical: baseUrl,
  },
};

export const revalidate = 600;

export default async function Home() {
  return (
    <div className="min-h-screen max-w-6xl relative space-y-12 mx-auto">
      <Header containerClassName="max-w-6xl" />

      <div className="w-full mx-auto text-center flex-col md:px-6 flex items-center md:items-center justify-start gap-8 overflow-hidden relative">
        <Link
          href={"/advertise"}
          className="leading-snug text-sm font-medium tracking-tight capitalize flex rounded-xl hover:underline dark:hover:no-underline items-center gap-x-2 dark:bg-background dark:border dark:border-violet-50/50 dark:hover:border-violet-50 transition-all duration-200 rounded px-2 py-0.5 dark:shadow-violet-50/10 dark:shadow-xl"
        >
          Support SaasList by going Featured
        </Link>
        <div className="space-y-6 mx-auto w-full">
          <h1 className="text-5xl sm:text-6xl xl:text-7xl max-w-5xl text-center mx-auto leading-tight font-mono font-extralight capitalize text-balance tracking-tighter xl:leading-tight">
            A curated directory of bootstrapped SaaS
          </h1>
          <p className="text-muted-foreground text-sm mx-auto text-balance max-w-3xl text-center w-full">
            Discover products built by independent founders. No funding, no
            noise, just simple, founder-built tools.
          </p>
        </div>
        <div className="space-y-4 relative z-10">
          <div className="space-x-2">
            <Button
              asChild
              size={"lg"}
              className="rounded-xl active:scale-98 border-primary bg-primary/75 text-primary-foreground hover:bg-primary/85 dark:bg-primary/90 dark:border-primary dark:hover:bg-primary border border-b-2 shadow-md shadow-zinc-950/20 ring ring-inset ring-white/15 transition-[filter,scale,background] duration-200 hover:brightness-110 dark:ring-transparent"
            >
              <Link href={"/products/new"}>Submit a product</Link>
            </Button>
            <Button
              asChild
              variant={"secondary"}
              size={"lg"}
              className="bg-muted hover:bg-background dark:bg-muted/25 dark:hover:bg-muted/50 dark:border-border inset-shadow-2xs inset-shadow-white dark:inset-shadow-transparent border border-zinc-300 shadow-sm shadow-zinc-950/10 ring-0 duration-150"
            >
              <Link href={"/browse"}>Browse the directory</Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Free to submit • No credit card required • No waitlist
          </p>
        </div>
      </div>

      <main className="p-4 sm:p-6 ">
        <Suspense fallback={<ProductGridSkeleton count={9} />}>
          <ProductGrid />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
