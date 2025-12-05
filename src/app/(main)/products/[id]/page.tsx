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
import { ProductViewTracker } from "@/features/products/components/product-view-tracker";
import { TechStackDisplay } from "@/features/products/components/tech-stack-display";
import { Product } from "@/features/products/types";
import { getCurrentUser } from "@/features/profiles/api/get-current-user";
import { createClient } from "@/lib/supabase/server";
import { addRefParam, getCategoryByTag, getTagSlug } from "@/utils/helpers";
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
      title: "Product Not Found | saaslist",
    };
  }

  const description = product.description
    ? `${product.description.substring(0, 155)}${product.description.length > 155 ? "..." : ""}`
    : `${product.name} is a bootstrapped SaaS tool built independently. View features, tech stack, and details.`;

  const imageUrl =
    product.logo_url || product.images?.[0] || `${baseUrl}/opengraph-image`;

  return {
    title: `${product.name} - ${product.tagline} | saaslist`,
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
    <div className="p-4 sm:p-6  space-y-8 w-full">
      <ProductViewTracker productId={id} />
      <div className="flex gap-6">
        <main className="flex-1 flex flex-col space-y-6">
          {isOwner && !product.is_featured && (
            <Link
              href={"/advertise"}
              className="text-center group bg-violet-50/50 hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 text-xs gap-x-1.5 p-2 outline-transparent not-disabled:cursor-pointer hover:not-disabled:outline-2 hover:not-disabled:outline-border/50 hover:not-disabled:border-ring focus-visible:outline-2 focus-visible:outline-border/50 focus-visible:border-ring flex w-full border rounded-xl font-medium flex-row justify-between items-center"
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

          <div className="flex items-center gap-x-4">
            <ProductLogo
              logoUrl={product.logo_url}
              productName={product.name}
              size="lg"
            />

            <div className="flex-1">
              <div className="flex items-center justify-between gap-4 md:block">
                <h1 className="text-xl xl:text-2xl font-medium">
                  {product.name}
                </h1>
                {(product.twitter_url ||
                  product.linkedin_url ||
                  product.instagram_url) && (
                  <div className="md:hidden flex items-center gap-2">
                    {product.twitter_url && (
                      <Button asChild variant={"secondary"} size={"xs"}>
                        <a
                          href={product.twitter_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Twitter"
                        >
                          <svg
                            className="size-3"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                        </a>
                      </Button>
                    )}
                    {product.linkedin_url && (
                      <Button asChild variant={"secondary"} size={"xs"}>
                        <a
                          href={product.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="LinkedIn"
                        >
                          <svg
                            className="size-3"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        </a>
                      </Button>
                    )}
                    {product.instagram_url && (
                      <Button asChild variant={"secondary"} size={"xs"}>
                        <a
                          href={product.instagram_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Instagram"
                        >
                          <svg
                            className="size-3"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                          </svg>
                        </a>
                      </Button>
                    )}
                  </div>
                )}
              </div>
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
                  href={addRefParam(product.website_url)}
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
            <FounderHoverCard userId={product.user_id}>
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
                href={addRefParam(product.website_url)}
                className="flex items-center justify-start text-muted-foreground gap-x-1"
                target="_blank"
                rel="noopener"
              >
                Visit
                <ArrowUpRight className="size-3.5" />
              </a>
            </Button>
          </div>

          <p className="text-pretty text-muted-foreground text-sm">
            {product.description}
          </p>

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
                    <Badge className="hover:underline" variant={"secondary"}>
                      {tag}
                    </Badge>
                  </Link>
                ) : (
                  <Badge variant={"secondary"} key={index}>
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
            {processedProduct.techstack &&
              processedProduct.techstack.length > 0 && (
                <TechStackDisplay techstack={processedProduct.techstack} />
              )}

            <ProductShare
              productId={product.id}
              productName={product.name}
              productTagline={product.tagline}
            />
            <ProductNavigation
              prevProduct={prevProduct ?? null}
              nextProduct={nextProduct ?? null}
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
