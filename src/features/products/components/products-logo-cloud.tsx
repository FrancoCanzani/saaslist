import { shuffleArray } from "@/utils/helpers";
import Image from "next/image";
import Link from "next/link";
import { getFeaturedProducts } from "../api/get-featured-products";

export const revalidate = 300;

export default async function ProductsLogoCloud() {
  const allProducts = await getFeaturedProducts();

  const productsWithLogos = allProducts.filter(
    (product) => product.logo_url && product.logo_url.trim() !== "",
  );

  if (productsWithLogos.length < 5) {
    return null;
  }

  // Randomly select up to 12 products from featured products with logos
  const shuffled = shuffleArray(productsWithLogos);
  const products = shuffled.slice(0, 12);

  const logoHeights = [
    "h-10",
    "h-11",
    "h-12",
    "h-14",
    "h-11",
    "h-10",
    "h-11",
    "h-12",
    "h-10",
    "h-11",
    "h-12",
    "h-14",
  ];

  return (
    <section className="py-12">
      <div className="mx-auto max-w-5xl">
        <p className="text-muted-foreground text-center text-sm">
          Trusted by these Featured Products
        </p>
        <div className="mx-auto mt-14 flex max-w-4xl flex-wrap items-center justify-center gap-x-12 gap-y-8 sm:gap-x-16 sm:gap-y-12">
          {products.map((product, index) => {
            const heightClass = logoHeights[index % logoHeights.length];
            const heightMap: Record<string, number> = {
              "h-10": 40,
              "h-11": 44,
              "h-12": 48,
              "h-14": 56,
            };
            const imageHeight = heightMap[heightClass] || 28;

            return (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                prefetch
                className="hover:opacity-80 transition-opacity"
              >
                <div className={`${heightClass} w-fit`}>
                  <Image
                    src={product.logo_url!}
                    alt={`${product.name} logo`}
                    height={imageHeight}
                    width={imageHeight * 5}
                    className="h-full w-auto object-contain dark:grayscale-25"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
