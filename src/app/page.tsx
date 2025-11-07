import Footer from "@/components/footer";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Meteors } from "@/components/ui/meteors";
import ProductList from "@/features/products/components/product-list";
import Link from "next/link";

export default async function Home() {
  return (
    <div className="min-h-screen max-w-6xl mx-auto">
      <Header />

      <div className="w-full py-12 md:py-20 text-start md:text-center flex-col px-6 flex items-start md:items-center justify-start gap-8 overflow-hidden relative">
        <Meteors
          number={10}
          className="bg-blaze-orange shadow-[0_0_0_1px_#ff5b0440] before:bg-linear-to-r before:from-blaze-orange before:to-transparent"
        />
        <Link
          href={"#"}
          className="leading-snug text-sm font-medium tracking-tight capitalize flex items-center gap-x-2 bg-blaze-orange/10 px-2 py-0.5 relative z-10"
        >
          Join our afiliate program
        </Link>
        <div className="space-y-4 relative z-10">
          <h2 className="md:text-6xl custom-selection text-4xl sm:text-5xl leading-tight font-medium  tracking-tighter xl:leading-tight text-balance">
            Get Noticed. Get Users. Get Results.
          </h2>
          <p className="text-muted-foreground text-sm md:text-base text-balance">
            Showcase your SaaS product to thousands of early adopters,
            entrepreneurs, and tech enthusiasts. Join the community of builders
            who are launching their next big thing.
          </p>
        </div>
        <div className="space-y-4 relative z-10">
          <div className="space-x-2">
            <Button
              asChild
              variant={"default"}
              size={"lg"}
              className="bg-blaze-orange hover:bg-blaze-orange/90"
            >
              <Link href={"/products/new"}>Submit your SaaS</Link>
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
