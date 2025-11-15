import Footer from "@/components/footer";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import ProductList from "@/features/products/components/product-list";
import Link from "next/link";
import { Suspense } from "react";

export default async function Home() {
  return (
    <div className="min-h-screen relative max-w-6xl mx-auto">
      <Header />

      <div className="w-full py-12 text-start md:text-center flex-col px-6 flex items-start md:items-center justify-start gap-8 overflow-hidden relative">
        <Link
          href={"#"}
          className="leading-snug text-sm font-medium tracking-tight capitalize flex items-center gap-x-2 bg-blaze-orange/10 dark:bg-background dark:border dark:border-blaze-orange/20 dark:hover:border-blaze-orange/30 transition-all duration-200 rounded px-2 py-0.5 dark:shadow-blaze-orange/10 dark:shadow-xl"
        >
          Join our afiliate program
        </Link>
        <div className="space-y-4 relative">
          <h1 className="custom-selection text-4xl sm:text-5xl leading-tight font-mono font-extralight tracking-tighter xl:leading-tight text-balance relative z-10">
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
              className="bg-blaze-orange/10 dark:bg-black dark:hover:bg-black/80 rounded-xl hover:bg-blaze-orange/20"
            >
              <Link href={"/products/new"}>Submit your SaaS</Link>
            </Button>
            <Button asChild variant={"secondary"} size={"lg"}>
              <Link href={"/browse"}>Browse Products</Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Free to submit • No credit card required • Launch in minutes
          </p>
        </div>
      </div>

      <main className="p-4 sm:p-6 lg:p-8 flex flex-col gap-8">
        <Suspense fallback={"Loading..."}>
          <ProductList date="today" />
          <ProductList date="yesterday" />
          <ProductList date="week" />
          <ProductList date="month" />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
