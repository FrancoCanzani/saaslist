import { createFileRoute, notFound } from "@tanstack/react-router"

import type { PublicProduct } from "@backend/routes/v1/products/lib/serialize"
import { CategoryPage } from "@features/catalog/category-page"
import { api, readJson } from "@lib/api"

export const Route = createFileRoute("/categories/$slug")({
  loader: async ({ params }) => {
    const [categoriesResponse, productsResponse] = await Promise.all([
      api.categories.$get(),
      api.products.$get({ query: { category: params.slug } }),
    ])
    const categories = await readJson<{
      categories: Array<{
        slug: string
        name: string
        description: string
        tags: string[]
        count: number
      }>
    }>(categoriesResponse)
    const category = categories.categories.find(
      (item) => item.slug === params.slug,
    )
    if (!category) {
      throw notFound()
    }
    const products = await readJson<{
      products: PublicProduct[]
      sponsored: PublicProduct[]
    }>(productsResponse)
    return { category, ...products }
  },
  component: CategoryPage,
})
