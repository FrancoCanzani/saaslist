import CommentSection from "@/features/products/components/comment-section";
import ProductSidebar from "@/features/products/components/product-sidebar";
import { Product } from "@/features/products/types";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: product, error } = await supabase
    .from("products")
    .select(
      `
      *,
      upvotes!left(user_id)
    `,
    )
    .eq("id", id)
    .single();

  if (error || !product) {
    notFound();
  }

  const processedProduct: Product = {
    ...product,
    is_upvoted: user
      ? (product.upvotes?.some((upvote: any) => upvote.user_id === user.id) ??
        false)
      : false,
  };

  const { data: comments } = await supabase
    .from("comments")
    .select(
      `
      *,
      user:profiles!comments_user_id_fkey(name, avatar_url)
    `,
    )
    .eq("product_id", id)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex gap-6">
        <main className="flex-1">
          <div className="flex items-start gap-x-6">
            <div className="rounded-md w-10 flex items-center justify-center h-10 bg-gray-100 p-1">
              {product.logo_url ? (
                <Image
                  src={product.logo_url}
                  alt={`${product.name} logo`}
                  width={30}
                  height={30}
                />
              ) : (
                <div className="h-9 w-9 flex items-center font-medium italic justify-center">
                  {product.name.split("")[0]}
                </div>
              )}
            </div>

            <div className="flex-1">
              <h2 className="text-3xl font-medium">{product.name}</h2>
              <h3 className="text-muted-foreground text-sm">
                {product.tagline}
              </h3>
              <p className="my-4">{product.description}</p>

              {product.demo_url && (
                <div className="my-4">
                  <div className="relative w-full max-w-2xl">
                    <iframe
                      src={
                        product.demo_url.includes("youtube.com")
                          ? product.demo_url.replace("watch?v=", "embed/")
                          : product.demo_url
                      }
                      className="w-full h-64 rounded-lg"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={`${product.name} demo video`}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <CommentSection
            productId={id}
            initialComments={comments || []}
            currentUserId={user?.id}
            commentsCount={product.comments_count || 0}
          />
        </main>

        <ProductSidebar product={processedProduct} />
      </div>
    </div>
  );
}
