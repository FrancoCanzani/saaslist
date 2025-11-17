import {
  Marquee,
  MarqueeContent,
  MarqueeFade,
  MarqueeItem,
} from "@/components/ui/marquee";
import { createClient } from "@/lib/supabase/server";
import { Product } from "../types";
import Image from "next/image";
import Link from "next/link";

async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_featured", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }

  return (products as Product[]) || [];
}

export default async function ProductsMarquee() {
  const products = await getFeaturedProducts();

  if (products.length <= 4) {
    return null;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="space-y-6">
        <h2 className="capitalize text-muted-foreground leading-tight text-center font-medium">
          Trusted by these Featured Products
        </h2>
        <div className="flex size-full items-center justify-center bg-background">
          <Marquee>
            <MarqueeFade side="left" />
            <MarqueeFade side="right" />
            <MarqueeContent>
              {products.map((product) => (
                <MarqueeItem key={product.id} className="h-20 w-20">
                  <Link
                    href={`/products/${product.id}`}
                    prefetch
                    className="flex items-center justify-center h-full w-full hover:opacity-80 transition-opacity"
                  >
                    {product.logo_url ? (
                      <Image
                        src={product.logo_url}
                        alt={`${product.name} logo`}
                        width={40}
                        height={40}
                        className="rounded-lg object-contain"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-20 w-20 rounded-lg text-2xl font-medium">
                        {product.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </Link>
                </MarqueeItem>
              ))}
            </MarqueeContent>
          </Marquee>
        </div>
      </div>
    </div>
  );
}
