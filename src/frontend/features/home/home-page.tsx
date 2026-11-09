import { Link, getRouteApi } from "@tanstack/react-router"

import { ProductList } from "@features/catalog/product-list"

const routeApi = getRouteApi("/")

export function HomePage() {
  const { products, sponsored, categories } = routeApi.useLoaderData()

  return (
    <div>
      <p className="text-sm text-muted">Reviewed bootstrapped software</p>
      <h1 className="mt-3 max-w-2xl text-4xl leading-tight tracking-tight">
        Tools built without funding, checked by a person before they go public.
      </h1>
      <p className="mt-4 max-w-xl text-muted">
        Local services and venture products stay out. A listing waits in review
        until it is approved.
      </p>
      <div className="mt-8 flex flex-wrap gap-2">
        {categories.map((category) => (
          <Link
            key={category.slug}
            to="/categories/$slug"
            params={{ slug: category.slug }}
            className="rounded-full border border-line bg-panel px-3 py-1 text-sm"
          >
            {category.name}
            <span className="text-muted"> {category.count}</span>
          </Link>
        ))}
      </div>
      <ProductList title="Sponsored" products={sponsored} />
      <ProductList title="Directory" products={products} />
      {products.length === 0 && sponsored.length === 0 ? (
        <p className="mt-12 border-t border-line pt-6 text-muted">
          Nothing is public yet. Submit a product and it will sit in review
          until it is approved.
        </p>
      ) : null}
    </div>
  )
}
