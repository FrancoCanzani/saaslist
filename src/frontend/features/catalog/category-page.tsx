import { getRouteApi } from "@tanstack/react-router"

import { ProductList } from "@features/catalog/product-list"

const routeApi = getRouteApi("/categories/$slug")

export function CategoryPage() {
  const { category, products, sponsored } = routeApi.useLoaderData()

  return (
    <div>
      <p className="text-sm text-muted">Bootstrapped {category.name}</p>
      <h1 className="mt-2 text-3xl tracking-tight">{category.name}</h1>
      <p className="mt-3 max-w-xl text-muted">{category.description}</p>
      <ProductList title="Sponsored" products={sponsored} />
      <ProductList title="Tools" products={products} />
      {products.length === 0 && sponsored.length === 0 ? (
        <p className="mt-10 text-muted">
          No approved tools in this category yet.
        </p>
      ) : null}
    </div>
  )
}
