import Footer from "@/components/footer";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import ProductList from "@/features/products/components/product-list";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  return (
    <div className="min-h-screen max-w-6xl mx-auto">
      <Header />
      <div className="py-10 flex items-center justify-center gap-4">
        <div className="w-1/2 space-y-6">
          <Button
            asChild
            variant={"outline"}
            size={"sm"}
            className="capitalize"
          >
            <Link href={"#"}>Join our afiliate program</Link>
          </Button>
          <div className="space-y-4">
            <h2 className="text-start text-balance w-full text-6xl font-medium">
              Get Noticed. Get Users. Get Results.
            </h2>
            <p className="text-muted-foreground text-pretty">
              Showcase your SaaS product to thousands of early adopters,
              entrepreneurs, and tech enthusiasts. Join the community of
              builders who are launching their next big thing.
            </p>
          </div>
          <div className="space-y-4">
            <div className="space-x-2">
              <Button asChild variant={"default"} size={"lg"}>
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
        <div className="w-1/2">
          <div className="relative overflow-hidden">
            <div className="flex gap-3 scale-90 origin-center">
              <div className="flex-1 flex flex-col gap-3">
                <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200">
                  <Image
                    src="/21st.png"
                    alt="21st SaaS"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200">
                  <Image
                    src="/mgx.png"
                    alt="MGX SaaS"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200">
                  <Image
                    src="/tana.png"
                    alt="Tana SaaS"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-3 mt-4">
                <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200">
                  <Image
                    src="/chroniclehq.png"
                    alt="ChronicleHQ SaaS"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200">
                  <Image
                    src="/screen-studio.png"
                    alt="Screen Studio SaaS"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200">
                  <Image
                    src="/rizon.png"
                    alt="Rizon SaaS"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
            <div className="absolute top-0 left-0 right-0 h-24 bg-linear-to-b from-background to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-background to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
      <main className="p-6 grid grid-cols-3 gap-3">
        <div className="col-span-2 space-y-4">
          <ProductList date="today" />
          <ProductList date="yesterday" />
          <ProductList date="week" />
          <ProductList date="month" />
        </div>
        <div className="col-span-1 space-y-4">
          <div className="bg-amber-200 p-3 rounded-xl rotate-2 space-y-3 border ring-2 ring-gray-200 shadow-sm hover:rotate-0 transition-all duration-300 outline-gray-100 outline-2">
            <h3 className="font-medium text-xl">Advertise in SaasList</h3>
            <p className="text-sm">
              Advertising helps you grow usage of your product by reaching
              millions of the most influential early adopters and techies around
              the globe.
            </p>
          </div>
          <div>Fearuted Saas</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
