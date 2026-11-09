import { Link } from "@tanstack/react-router"

import type { PublicProduct } from "@backend/routes/v1/products/lib/serialize"

import { pricingLabel } from "@features/catalog/pricing"

export function ProductList({
  title,
  products,
}: {
  title: string
  products: PublicProduct[]
}) {
  if (products.length === 0) {
    return null
  }

  return (
    <section className="mt-10">
      <h2 className="text-sm tracking-wide text-muted uppercase">{title}</h2>
      <div className="mt-2">
        {products.map((item) => (
          <Link
            key={item.id}
            to="/tools/$slug"
            params={{ slug: item.slug }}
            className="block border-t border-line py-4"
          >
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-lg">{item.name}</span>
              <span className="text-sm text-muted">
                {pricingLabel(item.pricingModel)}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted">{item.tagline}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
