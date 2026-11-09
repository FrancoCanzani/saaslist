import { Link, getRouteApi } from "@tanstack/react-router"

import { pricingLabel } from "@features/catalog/pricing"

const routeApi = getRouteApi("/tools/$slug")

export function ToolPage() {
  const { product } = routeApi.useLoaderData()

  return (
    <article>
      <p className="text-sm text-muted">
        <Link
          to="/categories/$slug"
          params={{ slug: product.category }}
          className="underline decoration-line underline-offset-4"
        >
          {product.categoryName}
        </Link>
        {product.sponsored ? " · Sponsored" : ""}
      </p>
      <h1 className="mt-2 text-4xl tracking-tight">{product.name}</h1>
      <p className="mt-3 max-w-xl text-lg text-muted">{product.tagline}</p>
      <dl className="mt-8 grid gap-4 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-muted">Pricing</dt>
          <dd>{pricingLabel(product.pricingModel)}</dd>
        </div>
        <div>
          <dt className="text-muted">Founder</dt>
          <dd>{product.founderName}</dd>
        </div>
        <div>
          <dt className="text-muted">Funding</dt>
          <dd>Bootstrapped</dd>
        </div>
      </dl>
      <p className="mt-8 max-w-2xl leading-7">{product.description}</p>
      <p className="mt-4 max-w-2xl text-muted">For {product.audience}</p>
      <div className="mt-6 flex flex-wrap gap-2 text-sm">
        {product.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-line px-3 py-1">
            {tag}
          </span>
        ))}
      </div>
      <a
        href={product.websiteUrl}
        className="mt-8 inline-flex rounded-md bg-accent px-3 py-2 text-sm text-accent-ink"
        rel={product.sponsored ? "sponsored noopener" : "noopener"}
        target="_blank"
      >
        Visit {product.name}
      </a>
    </article>
  )
}
