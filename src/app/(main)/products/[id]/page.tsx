import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CommentSection from "@/features/products/components/comment-section";
import ProductLogo from "@/features/products/components/product-logo";
import { ProductMediaCarousel } from "@/features/products/components/product-media-carousel";
import { ProductNavigation } from "@/features/products/components/product-navigation";
import { ProductShare } from "@/features/products/components/product-share";
import ProductSidebar from "@/features/products/components/product-sidebar";
import ReviewSection from "@/features/products/components/review-section";
import UpvoteButton from "@/features/products/components/upvote-button";
import { Product } from "@/features/products/types";
import { getCategoryByTag, getTagSlug } from "@/utils/helpers";
import { createClient } from "@/utils/supabase/server";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
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

  const { data: prevProduct } = await supabase
    .from("products")
    .select("id, name, logo_url")
    .lt("created_at", product.created_at)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const { data: nextProduct } = await supabase
    .from("products")
    .select("id, name, logo_url")
    .gt("created_at", product.created_at)
    .order("created_at", { ascending: true })
    .limit(1)
    .single();

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex gap-6">
        <main className="flex-1 flex flex-col gap-6">
          <div className="flex items-center gap-x-6">
            <div className="size-10 flex items-center justify-center shrink-0 rounded group-hover:scale-105 transition-all duration-300">
              <ProductLogo
                logoUrl={product.logo_url}
                productName={product.name}
                size={30}
              />
            </div>

            <div className="flex-1">
              <h2 className="text-xl xl:text-2xl font-medium">
                {product.name}
              </h2>
              <h3 className="text-muted-foreground text-sm">
                {product.tagline}
              </h3>
            </div>

            <div className="space-x-1.5 hidden md:flex items-center justify-end">
              <UpvoteButton
                product={processedProduct}
                label="Upvotes"
                className="text-sm"
              />
              <a
                href={product.website_url}
                className="text-sm flex items-center justify-start text-muted-foreground group gap-x-1 hover:underline underline-offset-4"
                target="_blank"
                rel="noopener"
              >
                Visit {product.name}
                <ArrowUpRight className="size-3.5 opacity-0 group-hover:opacity-100 transition-all duration-300" />
              </a>
            </div>
          </div>

          <div className="space-x-1.5 md:hidden flex items-center justify-start">
            <UpvoteButton
              product={processedProduct}
              label="Upvotes"
              className="text-sm"
            />
            <a
              href={product.website_url}
              className="text-sm flex items-center justify-start text-muted-foreground group gap-x-1 hover:underline underline-offset-4"
              target="_blank"
              rel="noopener"
            >
              Visit {product.name}
              <ArrowUpRight className="size-3.5 opacity-0 group-hover:opacity-100 transition-all duration-300" />
            </a>
          </div>

          <p className="text-pretty">{product.description}</p>

          <div>
            <h4 className="font-medium mb-1.5 text-sm">Tags</h4>
            <div className="flex flex-wrap gap-1.5">
              {product.tags.map((tag: string, index: number) => {
                const category = getCategoryByTag(tag);
                return category ? (
                  <Link
                    href={`/browse/${category.slug}/${getTagSlug(tag)}`}
                    className="hover:underline text-xs bg-gray-50 px-2 py-1 rounded inline-block transition-colors hover:bg-gray-100 dark:bg-neutral-950"
                    key={index}
                  >
                    {tag}
                  </Link>
                ) : (
                  <span
                    className="text-xs bg-gray-50 dark:bg-neutral-950 px-2 py-1 rounded inline-block"
                    key={index}
                  >
                    {tag}
                  </span>
                );
              })}
            </div>
          </div>

          <ProductMediaCarousel
            demoUrl={product.demo_url}
            images={product.images}
            productName={product.name}
          />

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

          <div className="block md:hidden space-y-6">
            <ProductNavigation
              prevProduct={prevProduct ?? null}
              nextProduct={nextProduct ?? null}
            />
            <ProductShare
              productId={product.id}
              productName={product.name}
              productTagline={product.tagline}
            />
          </div>
        </main>

        <ProductSidebar
          product={processedProduct}
          prevProduct={prevProduct ?? undefined}
          nextProduct={nextProduct ?? undefined}
        />
      </div>
    </div>
  );
}
