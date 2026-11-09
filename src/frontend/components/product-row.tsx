import { Link } from "@tanstack/react-router"
import { ChevronRight } from "lucide-react"

import type { PublicProduct } from "@backend/routes/v1/products/lib/serialize"

import { FeaturedBadge } from "./featured-badge"
import { ProductLogo } from "./product-logo"

export function ProductRow({ product }: { product: PublicProduct }) {
  return (
    <Link
      to="/tools/$slug"
      params={{ slug: product.slug }}
      className="group flex items-center gap-3 border-b border-border px-1 py-3 last:border-b-0 hover:bg-surface/80"
    >
      <ProductLogo productName={product.name} size="sm" />
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="truncate font-medium">{product.name}</span>
          {product.sponsored ? <FeaturedBadge /> : null}
        </span>
        <span className="block truncate text-sm text-muted-foreground">
          {product.tagline}
        </span>
      </span>
      <span className="hidden shrink-0 text-sm text-muted-foreground sm:block">
        {product.categoryName}
      </span>
      <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
    </Link>
  )
}

export function ProductRows({ products }: { products: PublicProduct[] }) {
  if (products.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        No products found
      </p>
    )
  }

  return (
    <div className="border-y border-border">
      {products.map((product) => (
        <ProductRow key={product.id} product={product} />
      ))}
    </div>
  )
}
