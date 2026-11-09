import { createFileRoute } from "@tanstack/react-router"

import type { PublicProduct } from "@backend/routes/v1/products/lib/serialize"
import { MinePage } from "@features/products/mine-page"
import { api, readJson } from "@lib/api"

export const Route = createFileRoute("/_authed/mine")({
  loader: async () => {
    const response = await api.products.mine.$get()
    return readJson<{ products: PublicProduct[] }>(response)
  },
  component: MinePage,
})
