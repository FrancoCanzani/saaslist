import { Button } from "@/components/ui/button";
import ProductCard from "@/features/products/components/product-card";
import { Product } from "@/features/products/types";
import { categories } from "@/utils/constants";
import { getCategoryBySlug, getTagSlug } from "@/utils/helpers";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 600;

export async function generateStaticParams() {
  return categories.map((category) => ({
    category: category.slug,
  }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = await params;

  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch all products that have any tag from this category
  const categoryTagsLower = category.tags.map((tag) => tag.toLowerCase());

  const { data: products, error } = await supabase
    .from("products")
    .select(
      `
      *,
      upvotes!left(user_id)
    `
    )
    .order("created_at", { ascending: false });

  const categoryProducts = (products || [])
    .filter((product: any) => {
      if (!product.tags || !Array.isArray(product.tags)) return false;
      return product.tags.some((tag: string) =>
        categoryTagsLower.includes(tag.toLowerCase())
      );
    })
    .map((product: any) => ({
      ...product,
      is_upvoted: user
        ? product.upvotes?.some((upvote: any) => upvote.user_id === user.id)
        : false,
    })) as Product[];

  // Count products per tag
  const tagCounts = new Map<string, number>();
  category.tags.forEach((tag) => {
    const count = categoryProducts.filter((product) =>
      product.tags?.some((t) => t.toLowerCase() === tag.toLowerCase())
    ).length;
    if (count > 0) {
      tagCounts.set(tag, count);
    }
  });

  const tagsWithProducts = Array.from(tagCounts.entries()).sort(
    (a, b) => b[1] - a[1]
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
            {category.description && (
              <p className="text-muted-foreground">{category.description}</p>
            )}
          </div>

          <div className="text-sm text-muted-foreground">
            {categoryProducts.length}{" "}
            {categoryProducts.length === 1 ? "product" : "products"}
          </div>
        </div>

        {tagsWithProducts.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-3">Browse by tag</h3>
            <div className="flex flex-wrap gap-2">
              {tagsWithProducts.map(([tag, count]) => (
                <Button
                  key={tag}
                  asChild
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  <Link href={`/browse/${categorySlug}/${getTagSlug(tag)}`}>
                    {tag} ({count})
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {categoryProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-sm">
            No products in this category yet.
          </p>
          <Button asChild className="mt-4" size="sm">
            <Link href="/products/new">Submit the first product</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
