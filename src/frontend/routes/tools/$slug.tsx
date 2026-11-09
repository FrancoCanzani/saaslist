import { createFileRoute } from "@tanstack/react-router"

import type { PublicProduct } from "@backend/routes/v1/products/lib/serialize"
import { ToolPage } from "@features/catalog/tool-page"
import { api, readJson } from "@lib/api"

export const Route = createFileRoute("/tools/$slug")({
  loader: async ({ params }) => {
    const response = await api.products[":slug"].$get({
      param: { slug: params.slug },
    })
    return readJson<{ product: PublicProduct }>(response)
  },
  component: ToolPage,
})
