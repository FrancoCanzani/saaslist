"use client";

import { Button } from "@/components/ui/button";
import UpvoteButton from "@/features/products/components/upvote-button";
import { Product } from "@/features/products/types";
import { tags } from "@/utils/constants";
import { copyToClipboard } from "@/utils/helpers";
import { formatDistanceToNowStrict } from "date-fns";
import Link from "next/link";
import { toast } from "sonner";

function getCategoryForTag(tag: string) {
  const category = tags.find((cat) =>
    cat.tags.some((t) => t.toLowerCase() === tag.toLowerCase()),
  );
  return category ? category.name.toLowerCase().replace(/\s+/g, "-") : null;
}

export default function ProductSidebar({ product }: { product: Product }) {
  async function handleCopyLink() {
    const success = await copyToClipboard(
      `${process.env.NEXT_PUBLIC_BASE_URL}/product/${product.id}`,
    );
    if (success) {
      toast.success("Link copied to clipboard!");
    } else {
      toast.error("Failed to copy link to clipboard");
    }
  }

  return (
    <div className="w-80 shrink-0 space-y-6">
      <div>
        <h4 className="font-medium">
          Launched{" "}
          {formatDistanceToNowStrict(new Date(product.created_at), {
            addSuffix: true,
          })}
        </h4>
      </div>

      <div className="flex gap-2">
        <Button asChild variant={"outline"} className="" size={"sm"}>
          <a href={product.website_url} target="_blank" rel="noopener">
            Visit Website
          </a>
        </Button>
        <UpvoteButton product={product} label="Upvote" size="sm" />
      </div>

      <div>
        <h4 className="font-semibold mb-2 text-sm">Labels</h4>
        <div className="space-x-1">
          {product.tags.slice(0, 3).map((tag: string, index: number) => {
            const categorySlug = getCategoryForTag(tag);
            return categorySlug ? (
              <Link
                href={`/browse/${categorySlug}`}
                className="hover:underline text-sm bg-gray-100 px-1.5 py-0.5 rounded capitalize cursor-pointer inline-block"
                key={index}
              >
                {tag}
              </Link>
            ) : (
              <span
                className="text-sm bg-gray-100 px-1.5 py-0.5 rounded capitalize inline-block"
                key={index}
              >
                {tag}
              </span>
            );
          })}
        </div>
      </div>

      {product.founder_name && (
        <div>
          <h4 className="font-semibold mb-2 text-sm">Founder</h4>
          <Link
            href={`/founder/${product.user_id}`}
            className="text-sm font-medium hover:underline"
          >
            {product.founder_name}
          </Link>
        </div>
      )}

      {(product.twitter_url ||
        product.linkedin_url ||
        product.product_hunt_url) && (
        <div>
          <h4 className="font-semibold mb-2 text-sm">Socials</h4>
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
        <div className="border rounded-lg p-4">
          <h4 className="font-semibold mb-2 text-sm">Open Source</h4>
          <a
            href={product.repo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm hover:underline text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            View Repository
          </a>
        </div>
      )}

      <div className="flex flex-col space-y-3">
        <h4 className="font-semibold text-sm">Share</h4>
        <div className="space-x-1 text-xs flex items-center justify-start  hover:bg-gray-50 cursor-pointer border text-secondary-foreground h-8 rounded-md gap-1.5 px-3">
          <button
            onClick={async () => await handleCopyLink()}
            className="truncate"
          >{`${process.env.NEXT_PUBLIC_BASE_URL}/product/${product.id}`}</button>
        </div>
        <p className="text-xs">
          Check out our <span className="underline">Launch Guide</span> on how
          to reach in other platforms.
        </p>
      </div>
    </div>
  );
}
