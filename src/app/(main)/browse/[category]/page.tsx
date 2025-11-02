import CategoryProducts from "@/features/browse/components/category-products";
import { Product } from "@/features/products/types";
import { tags } from "@/utils/constants";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

export const revalidate = 600;

export async function generateStaticParams() {
  return tags.map((category) => ({
    category: category.name.toLowerCase().replace(/\s+/g, "-"),
  }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = await params;

  const categoryName = categorySlug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const category = tags.find(
    (cat) => cat.name.toLowerCase() === categoryName.toLowerCase(),
  );

  if (!category) {
    notFound();
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: products, error } = await supabase
    .from("products")
    .select(
      `
      *,
      upvotes!left(user_id)
    `,
    )
    .order("created_at", { ascending: false });

  const categoryTagsLower = category.tags.map((tag) => tag.toLowerCase());

  const categoryProducts = (products || [])
    .filter((product: any) => {
      if (!product.tags || !Array.isArray(product.tags)) return false;
      return product.tags.some((tag: string) =>
        categoryTagsLower.includes(tag.toLowerCase()),
      );
    })
    .map((product: any) => ({
      ...product,
      is_upvoted: user
        ? product.upvotes?.some((upvote: any) => upvote.user_id === user.id)
        : false,
    })) as Product[];

  return <CategoryProducts category={category} products={categoryProducts} />;
}
