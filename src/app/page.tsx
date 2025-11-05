import Footer from "@/components/footer";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import ProductList from "@/features/products/components/product-list";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  return (
    <div className="min-h-screen max-w-6xl mx-auto">
      <Header />

      <div className="w-full py-12 md:py-20 text-start md:text-center flex-col px-6 flex items-start md:items-center justify-start gap-8 overflow-hidden">
        <Link
          href={"#"}
          className="leading-snug font-medium tracking-tight text-blue-800 capitalize flex items-center gap-x-2"
        >
          Join our afiliate program <ArrowUpRight className="size-4" />
        </Link>
        <div className="space-y-4">
          <h2 className="md:text-6xl text-4xl sm:text-5xl leading-tight font-medium tracking-tighter xl:leading-tight text-balance">
            Get Noticed. Get Users. Get Results.
          </h2>
          <p className="text-muted-foreground text-sm md:text-base text-balance">
            Showcase your SaaS product to thousands of early adopters,
            entrepreneurs, and tech enthusiasts. Join the community of builders
            who are launching their next big thing.
          </p>
        </div>
        <div className="space-y-4">
          <div className="space-x-2">
            <Button asChild variant={"default"} size={"lg"}>
              <Link
                href={"/products/new"}
                className="text-white leading-none bg-linear-to-br from-blue-500 to-blue-700 hover:scale-95 transition-all duration-200 shadow-lg shadow-blue-500/40"
              >
                Submit your SaaS
              </Link>
            </Button>
            <Button asChild variant={"outline"} size={"lg"}>
              <Link href={"/browse"}>Browse Products</Link>
            </Button>
          </div>
          <p className="text-xs font-medium">
            Free to submit • No credit card required • Launch in minutes
          </p>
        </div>
      </div>

      <main className="p-6 flex flex-col gap-6">
        <ProductList date="today" />
        <ProductList date="yesterday" />
        <ProductList date="week" />
        <ProductList date="month" />
      </main>

      <Footer />
    </div>
  );
}
