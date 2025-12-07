import Footer from "@/components/footer";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import ProductGrid from "@/features/products/components/product-grid";
import ProductGridSkeleton from "@/features/products/components/skeletons/product-grid-skeleton";
import { ArrowDown, ArrowRight } from "lucide-react";
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
    <div className="min-h-screen mx-auto">
      <Header />

      <div className="mx-auto max-w-7xl p-6 lg:px-12 lg:pb-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="flex-col gap-4 hidden lg:flex">
            <Link
              href="/"
              className="font-mono  leading-none font-medium text-3xl"
            >
              SaasList
            </Link>
            <ArrowDown className="text-muted-foreground hover:text-black dark:hover:text-white" />
          </div>

          <div className="flex flex-col">
            <h1 className="text-5xl sm:text-6xl xl:text-7xl font-mono font-extralight leading-none tracking-tighter text-balance">
              A curated directory of bootstrapped SaaS
            </h1>

            <p className="mt-6 text-balance lg:text-pretty text-sm sm:text-lg text-muted-foreground max-w-2xl">
              Discover products built by independent founders. No funding, no
              noise, just simple, founder-built tools.
            </p>

            <div className="flex mt-8 lg:hidden flex-wrap gap-3">
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
                <Link href={"/browse/all"}>Browse the directory</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-12">
        <Suspense fallback={<ProductGridSkeleton count={9} />}>
          <ProductGrid />
        </Suspense>
      </main>

      <div className="w-full py-12 text-sm flex items-center justify-center">
        <Link href={"/browse/all"} className="group">
          <span className="text-muted-foreground capitalize group-hover:text-foreground transition-colors flex items-center gap-1">
            Browse the directory
            <ArrowRight className="size-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </span>
        </Link>
      </div>
      <Footer />
    </div>
  );
}
