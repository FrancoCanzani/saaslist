"use client";

import { Badge } from "@/components/ui/badge";
import { ProductNavigation } from "@/features/products/components/product-navigation";
import { ProductShare } from "@/features/products/components/product-share";
import { Product } from "@/features/products/types";
import { formatDistanceToNowStrict } from "date-fns";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface NavigationProduct {
  id: string;
  name: string;
  logo_url?: string | null;
}

interface ProductSidebarProps {
  product: Product;
  prevProduct?: NavigationProduct | null;
  nextProduct?: NavigationProduct | null;
}

export default function ProductSidebar({
  product,
  prevProduct,
  nextProduct,
}: ProductSidebarProps) {
  return (
    <div className="w-80 hidden md:block shrink-0 space-y-6">
      <div>
        <div className="font-medium flex items-center justify-start gap-x-1">
          Launched{" "}
          {formatDistanceToNowStrict(new Date(product.created_at), {
            addSuffix: true,
          })}{" "}
          by{" "}
          <Link
            href={`/founders/${product.user_id}`}
            className="flex underline hover:text-blue-600 items-center justify-start gap-x-1 hover:underline"
          >
            {product.founder_name}
          </Link>
        </div>
      </div>

      <ProductNavigation
        prevProduct={prevProduct ?? null}
        nextProduct={nextProduct ?? null}
      />

      {product.platforms && product.platforms.length > 0 && (
        <div>
          <h4 className="font-medium mb-2 text-sm">Available on</h4>
          <div className="flex flex-wrap gap-1.5">
            {product.platforms.map((platform) => (
              <Badge
                variant={"secondary"}
                className="capitalize font-normal text-xs"
                key={platform}
              >
                {platform === "browser_extension"
                  ? "Browser Extension"
                  : platform === "api"
                    ? "API"
                    : platform === "ios"
                      ? "iOS"
                      : platform}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {(product.twitter_url ||
        product.linkedin_url ||
        product.product_hunt_url) && (
        <div>
          <h4 className="font-medium mb-2">Socials</h4>
          <div className="flex gap-2">
            {product.twitter_url && (
              <a
                href={product.twitter_url}
                target="_blank"
                rel="noopener noreferrer"
                className="size-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                title="Twitter"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            )}
            {product.linkedin_url && (
              <a
                href={product.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="size-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                title="LinkedIn"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            )}
            {product.product_hunt_url && (
              <a
                href={product.product_hunt_url}
                target="_blank"
                rel="noopener noreferrer"
                className="size-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                title="Product Hunt"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M13.604 9.4h-3.405v3.2h3.405a1.6 1.6 0 1 0 0-3.2M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0m1.604 14.4h-3.405V18H7.801V6h5.803a4.4 4.4 0 1 1 0 8.4" />
                </svg>
              </a>
            )}
          </div>
        </div>
      )}

      {product.repo_url && (
        <div>
          <h4 className="font-medium mb-2 text-sm">Open Source</h4>
          <a
            href={product.repo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-x-1 text-sm hover:underline"
          >
            View Repository <ArrowUpRight className="size-3" />
          </a>
        </div>
      )}

      <ProductShare
        productId={product.id}
        productName={product.name}
        productTagline={product.tagline}
      />
    </div>
  );
}
