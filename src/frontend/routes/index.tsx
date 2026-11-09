import { createFileRoute } from "@tanstack/react-router"

import type { PublicProduct } from "@backend/routes/v1/products/lib/serialize"
import { HomePage } from "@features/home/home-page"
import { api, readJson } from "@lib/api"

type CategorySummary = {
  slug: string
  name: string
  description: string
  tags: string[]
  count: number
}

export const Route = createFileRoute("/")({
  loader: async () => {
    const [productsResponse, categoriesResponse] = await Promise.all([
      api.products.$get({ query: {} }),
      api.categories.$get(),
    ])
    const products = await readJson<{
      products: PublicProduct[]
      sponsored: PublicProduct[]
    }>(productsResponse)
    const categories = await readJson<{ categories: CategorySummary[] }>(
      categoriesResponse,
    )
    return { ...products, categories: categories.categories }
  },
  component: HomePage,
})
