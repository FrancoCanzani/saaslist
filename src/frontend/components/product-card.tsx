import { Link } from "@tanstack/react-router"
import { ArrowRight } from "lucide-react"

import type { PublicProduct } from "@backend/routes/v1/products/lib/serialize"

import { Card } from "./ui/card"
import { FeaturedBadge } from "./featured-badge"
import { ProductLogo } from "./product-logo"

export function ProductCard({ product }: { product: PublicProduct }) {
  return (
    <Link to="/tools/$slug" params={{ slug: product.slug }} className="w-full max-w-sm">
      <Card className="flex h-full w-full max-w-sm flex-col gap-5 rounded">
        <div className="flex items-center justify-start gap-1.5">
          <ProductLogo productName={product.name} size="sm" />
          <div className="flex w-full items-center justify-between">
            <span className="truncate font-medium">{product.name}</span>
            {product.sponsored ? <FeaturedBadge /> : null}
          </div>
        </div>

        <p className="text-xs">{product.tagline}</p>

        <p className="line-clamp-4 flex-1 text-xs text-muted-foreground">
          {product.description}
        </p>

        <div className="flex items-center justify-end">
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground transition-colors group-hover:text-foreground">
            View Product
            <ArrowRight className="size-3 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
          </span>
        </div>
      </Card>
    </Link>
  )
}

export function ProductGrid({ products }: { products: PublicProduct[] }) {
  if (products.length === 0) {
    return (
      <div className="space-y-6">
        <div
          role="alert"
          className="relative w-full rounded-xl border bg-card px-4 py-3 text-sm text-card-foreground"
        >
          <p className="mx-auto">Ups! It looks like we have nothing to show here</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 items-stretch justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
