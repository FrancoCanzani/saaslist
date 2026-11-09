import { createFileRoute } from "@tanstack/react-router"

import type { PublicProduct } from "@backend/routes/v1/products/lib/serialize"
import { HomePage } from "@features/home/home-page"
import { api, readJson } from "@lib/api"

export const Route = createFileRoute("/")({
  loader: async () => {
    const productsResponse = await api.products.$get({ query: {} })
    return readJson<{
      products: PublicProduct[]
      sponsored: PublicProduct[]
    }>(productsResponse)
  },
  component: HomePage,
})
