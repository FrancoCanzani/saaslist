import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CommentSection from "@/features/products/components/comment-section";
import ProductLogo from "@/features/products/components/product-logo";
import ProductSidebar from "@/features/products/components/product-sidebar";
import ReviewSection from "@/features/products/components/review-section";
import { Product } from "@/features/products/types";
import { createClient } from "@/utils/supabase/server";
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
      upvotes!left(user_id),
      founder:profiles!products_user_id_fkey(name)
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
    founder_name: product.founder?.name,
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

  const { data: reviews } = await supabase
    .from("reviews")
    .select(
      `
      *,
      user:profiles!reviews_user_id_fkey(name, avatar_url)
    `,
    )
    .eq("product_id", id)
    .order("created_at", { ascending: false });

  let hasUserReviewed = false;
  if (user) {
    const { data: userReview } = await supabase
      .from("reviews")
      .select("id")
      .eq("product_id", id)
      .eq("user_id", user.id)
      .single();

    hasUserReviewed = !!userReview;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex gap-6">
        <main className="flex-1">
          <div className="flex items-start gap-x-6">
            <div className="rounded-md w-10 flex items-center justify-center h-10 bg-gray-100 p-1">
              <ProductLogo
                logoUrl={product.logo_url}
                productName={product.name}
                size={30}
              />
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

          <Tabs defaultValue="reviews" className="mt-8">
            <TabsList>
              <TabsTrigger value="reviews" className="text-xs">
                Reviews ({product.reviews_count || 0})
              </TabsTrigger>
              <TabsTrigger value="comments" className="text-xs">
                Comments ({product.comments_count || 0})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="reviews">
              <ReviewSection
                productId={id}
                initialReviews={reviews || []}
                currentUserId={user?.id}
                averageRating={
                  reviews && reviews.length > 0
                    ? reviews.reduce((sum, r) => sum + r.rating, 0) /
                      reviews.length
                    : 0
                }
                hasUserReviewed={hasUserReviewed}
              />
            </TabsContent>

            <TabsContent value="comments">
              <CommentSection
                productId={id}
                initialComments={comments || []}
                currentUserId={user?.id}
                commentsCount={product.comments_count || 0}
              />
            </TabsContent>
          </Tabs>
        </main>

        <ProductSidebar product={processedProduct} />
      </div>
    </div>
  );
}
