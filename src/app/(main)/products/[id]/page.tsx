import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CommentSection from "@/features/products/components/comment-section";
import ProductLogo from "@/features/products/components/product-logo";
import { ProductMediaCarousel } from "@/features/products/components/product-media-carousel";
import { ProductNavigation } from "@/features/products/components/product-navigation";
import { ProductShare } from "@/features/products/components/product-share";
import ProductSidebar from "@/features/products/components/product-sidebar";
import ReviewSection from "@/features/products/components/review-section";
import { UpdateSection } from "@/features/products/components/update-section";
import UpvoteButton from "@/features/products/components/upvote-button";
import { Product } from "@/features/products/types";
import { getCategoryByTag, getTagSlug } from "@/utils/helpers";
import { createClient } from "@/utils/supabase/server";
import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"; 

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) {
    return {
      title: "Product Not Found | SaasList",
    };
  }

  const description = product.description
    ? `${product.description.substring(0, 155)}${product.description.length > 155 ? "..." : ""}`
    : `${product.tagline} - Discover ${product.name} and other SaaS products on SaasList.`;

  const imageUrl = product.logo_url || product.images?.[0] || `${baseUrl}/opengraph-image`;

  return {
    title: `${product.name} - ${product.tagline} | SaasList`,
    description,
    alternates: {
      canonical: `${baseUrl}/products/${id}`,
    },
    openGraph: {
      title: `${product.name} - ${product.tagline}`,
      description,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${product.name} - ${product.tagline}`,
        },
      ],
      url: `${baseUrl}/products/${id}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} - ${product.tagline}`,
      description,
      images: [imageUrl],
    },
  };
}

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

  const { data: updates } = await supabase
    .from("product_updates")
    .select(
      `
      *,
      user:profiles!product_updates_user_id_fkey(name, avatar_url)
    `,
    )
    .eq("product_id", id)
    .order("created_at", { ascending: false });

  const isOwner = user?.id === product.user_id;

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
                <h1 className="text-xl xl:text-2xl font-medium">
                  {product.name}
                </h1>
                <h2 className="text-muted-foreground text-sm">
                  {product.tagline}
                </h2>
              </div>

            <div className="space-x-1.5 hidden lg:flex items-center justify-end">
              <UpvoteButton product={processedProduct} size="xs" />
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

          <div className="space-x-1.5 lg:hidden flex items-center justify-start">
            <UpvoteButton product={processedProduct} className="text-sm" />
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

          <p className="text-pretty text-sm">{product.description}</p>

          <div>
            <h4 className="font-medium mb-1.5 text-sm">Tags</h4>
            <div className="flex flex-wrap gap-1.5">
              {product.tags.map((tag: string, index: number) => {
                const category = getCategoryByTag(tag);
                return category ? (
                  <Link
                    href={`/browse/${category.slug}/${getTagSlug(tag)}`}
                    key={index}
                  >
                    <Badge
                      className="hover:underline rounded font-normal text-xs"
                      variant={"secondary"}
                    >
                      {tag}
                    </Badge>
                  </Link>
                ) : (
                  <Badge className="hover:underline text-xs" key={index}>
                    {tag}
                  </Badge>
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
              <TabsTrigger value="updates" className="text-xs">
                Updates ({updates?.length || 0})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="updates">
              <UpdateSection
                productId={id}
                initialUpdates={updates || []}
                isOwner={isOwner}
              />
            </TabsContent>

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
