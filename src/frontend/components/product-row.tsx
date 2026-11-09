import { Link } from "@tanstack/react-router"
import { ChevronRight } from "lucide-react"

import type { PublicProduct } from "@backend/routes/v1/products/lib/serialize"

import { FeaturedBadge } from "./featured-badge"
import { LikeButton } from "./like-button"
import { ProductLogo } from "./product-logo"

export function ProductRow({
  product,
  onLike,
}: {
  product: PublicProduct
  onLike?: (next: { likeCount: number; liked: boolean }) => void
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border/70 bg-background px-4 py-4 transition-colors hover:border-border hover:bg-surface/80 sm:gap-5 sm:px-5 sm:py-5">
      <Link
        to="/tools/$slug"
        params={{ slug: product.slug }}
        className="flex min-w-0 flex-1 items-center gap-4 sm:gap-5"
      >
        <ProductLogo productName={product.name} size="md" />
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="truncate font-medium">{product.name}</span>
            {product.sponsored ? <FeaturedBadge /> : null}
          </span>
          <span className="mt-1 block truncate text-sm text-muted-foreground">
            {product.tagline}
          </span>
        </span>
        <span className="hidden shrink-0 text-sm text-muted-foreground md:block">
          {product.categoryName}
        </span>
        <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
      </Link>
      <LikeButton
        slug={product.slug}
        likeCount={product.likeCount}
        liked={product.liked}
        onChange={onLike}
      />
    </div>
  )
}

export function ProductRows({
  products,
  onLike,
}: {
  products: PublicProduct[]
  onLike?: (id: string, next: { likeCount: number; liked: boolean }) => void
}) {
  if (products.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">
        No products found
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {products.map((product) => (
        <ProductRow
          key={product.id}
          product={product}
          onLike={
            onLike
              ? (next) => {
                  onLike(product.id, next)
                }
              : undefined
          }
        />
      ))}
    </div>
  )
}
