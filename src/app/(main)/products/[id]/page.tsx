import { ProductViewTracker } from "@/components/product-view-tracker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FeedSection } from "@/features/products/components/feed/feed-section";
import { FounderHoverCard } from "@/features/products/components/founder-hover-card";
import LikeButton from "@/features/products/components/like-button";
import ProductLogo from "@/features/products/components/product-logo";
import { ProductMediaCarousel } from "@/features/products/components/product-media-carousel";
import { ProductNavigation } from "@/features/products/components/product-navigation";
import { ProductShare } from "@/features/products/components/product-share";
import ProductSidebar from "@/features/products/components/product-sidebar";
import { Product } from "@/features/products/types";
import { getCurrentUser } from "@/features/profiles/api";
import { createClient } from "@/lib/supabase/server";
import { getCategoryByTag, getTagSlug } from "@/utils/helpers";
import { formatDistanceToNowStrict } from "date-fns";
import { ArrowRight, ArrowUpRight } from "lucide-react";
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

  const imageUrl =
    product.logo_url || product.images?.[0] || `${baseUrl}/opengraph-image`;

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
  const { user } = await getCurrentUser();

  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select(
      `
      *,
      likes!left(user_id),
      founder:profiles!products_user_id_fkey(name)
    `,
    )
    .eq("id", id)
    .single();

  if (error || !product) {
    notFound();
  }

  const { likes_count, ...productRest } = product;
  const processedProduct: Product = {
    ...productRest,
    likes_count,
    is_liked: user
      ? (product.likes?.some((like: any) => like.user_id === user.id) ?? false)
      : false,
    founder_name: product.founder?.name,
  };

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

  const isOwner = user?.id === product.user_id;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <ProductViewTracker productId={id} />
      <div className="flex gap-6">
        <main className="flex-1 flex flex-col space-y-6">
          {isOwner && !product.is_featured && (
            <Link
              href={"/advertise"}
              className="text-center group bg-violet-50/50 hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 text-xs gap-x-1.5 p-2 outline-transparent not-disabled:cursor-pointer hover:not-disabled:outline-2 hover:not-disabled:outline-border/50 hover:not-disabled:border-ring focus-visible:outline-2 focus-visible:outline-border/50 focus-visible:border-ring flex w-full border rounded font-medium flex-row justify-between items-center"
            >
              <div className="flex items-center justify-start gap-x-1.5">
                <span className="bg-black text-white px-1 rounded shadow">
                  Add
                </span>
                Go Pro and unlock more reach and insights
              </div>
              <div className="flex items-center justify-end gap-x-1.5">
                More info
                <ArrowRight className="size-3 opacity-0 group-hover:opacity-100 transition-all duration-300" />
              </div>
            </Link>
          )}

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

            <div className="space-x-1.5 hidden xl:flex items-center justify-end">
              <LikeButton product={processedProduct} variant={"secondary"} />
              <Button
                asChild
                variant={"secondary"}
                size={"xs"}
                className="font-medium rounded-xl"
              >
                <a
                  href={product.website_url}
                  className="flex items-center justify-start text-muted-foreground gap-x-1"
                  target="_blank"
                  rel="noopener"
                >
                  Visit
                  <ArrowUpRight className="size-3.5" />
                </a>
              </Button>
            </div>
          </div>

          <div className="flex text-sm items-center gap-x-1 font-medium">
            <span>Launched</span>
            <span>
              {formatDistanceToNowStrict(new Date(product.created_at), {
                addSuffix: true,
              })}
            </span>
            <span>by</span>
            <FounderHoverCard
              userId={product.user_id}
            >
              <Link
                href={`/founders/${product.user_id}`}
                className="underline hover:text-blue-600 transition-colors"
              >
                {processedProduct.founder_name || "Founder"}
              </Link>
            </FounderHoverCard>
          </div>

          <div className="space-x-1.5 xl:hidden flex items-center justify-start">
            <LikeButton
              product={processedProduct}
              variant={"secondary"}
              size={"sm"}
            />
            <Button
              asChild
              variant={"secondary"}
              size={"sm"}
              className="font-medium rounded-xl"
            >
              <a
                href={product.website_url}
                className="flex items-center justify-start text-muted-foreground gap-x-1"
                target="_blank"
                rel="noopener"
              >
                Visit
                <ArrowUpRight className="size-3.5" />
              </a>
            </Button>
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
                  <Badge
                    variant={"secondary"}
                    className="hover:underline text-xs"
                    key={index}
                  >
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

          <FeedSection
            productId={id}
            currentUserId={user?.id}
            isOwner={isOwner}
          />

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
