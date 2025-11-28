import { Separator } from "@/components/ui/separator";
import { Product } from "@/features/products/types";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { BrowseProductCard } from "./browse-product-card";

interface CategoryWithProducts {
  name: string;
  slug: string;
  description?: string;
  tags: string[];
  products: Product[];
  totalCount: number;
}

export function BrowseContent({ categories }: {
  categories: CategoryWithProducts[];
}) {

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 w-full">
      <div>
        <h1 className="text-xl font-medium">Browse Products</h1>
        <h2 className="text-muted-foreground text-sm">
          Explore products by category
        </h2>
      </div>

      <div>
        {categories.map((category, index) => (
          <div key={category.slug}>
            <section className="py-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-lg">{category.name}</h3>
                <Link
                  href={`/browse/${category.slug}`}
                  className="group flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  See all {category.totalCount > 0 && `(${category.totalCount})`}
                  <ArrowRight className="size-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              </div>

              {category.products.length > 0 ? (
                <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 scrollbar-hide">
                  {category.products.map((product) => (
                    <BrowseProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-4">
                  No products yet
                </p>
              )}
            </section>
            {index < categories.length - 1 && <Separator />}
          </div>
        ))}
      </div>
    </div>
  );
}
