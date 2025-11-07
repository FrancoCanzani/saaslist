import { Button } from "@/components/ui/button";
import ProductCard from "@/features/products/components/product-card";
import { Product } from "@/features/products/types";
import { categories } from "@/utils/constants";
import { getCategoryBySlug, getTagSlug } from "@/utils/helpers";
import { createClient } from "@/utils/supabase/server";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 600;

export async function generateStaticParams() {
  const params: { category: string; tag: string }[] = [];

  categories.forEach((category) => {
    category.tags.forEach((tag) => {
      params.push({
        category: category.slug,
        tag: getTagSlug(tag),
      });
    });
  });

  return params;
}

export default async function CategoryTagPage({
  params,
}: {
  params: Promise<{ category: string; tag: string }>;
}) {
  const { category: categorySlug, tag: tagSlug } = await params;

  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  // Find the tag in this category
  const tag = category.tags.find((t) => getTagSlug(t) === tagSlug);

  if (!tag) {
    notFound();
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch products with this specific tag
  const { data: products, error } = await supabase
    .from("products")
    .select(
      `
      *,
      upvotes!left(user_id)
    `,
    )
    .contains("tags", [tag])
    .order("created_at", { ascending: false });

  const processedProducts = (products || []).map((product: any) => ({
    ...product,
    is_upvoted: user
      ? product.upvotes?.some((upvote: any) => upvote.user_id === user.id)
      : false,
  })) as Product[];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href={`/browse/${categorySlug}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to {category.name}
          </Link>
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{tag}</h1>
            <p className="text-muted-foreground">
              in{" "}
              <Link
                href={`/browse/${categorySlug}`}
                className="hover:underline font-medium"
              >
                {category.name}
              </Link>
            </p>
          </div>

          <div className="text-sm text-muted-foreground">
            {processedProducts.length}{" "}
            {processedProducts.length === 1 ? "product" : "products"}
          </div>
        </div>
      </div>

      {processedProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-sm">
            No products found with this tag yet.
          </p>
          <Button asChild className="mt-4" size="sm">
            <Link href="/products/new">Submit the first product</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {processedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
