import { createFileRoute } from "@tanstack/react-router"

import type { PublicProduct } from "@backend/routes/v1/products/lib/serialize"
import { ReviewPage } from "@features/review/review-page"
import { api, readJson } from "@lib/api"

export const Route = createFileRoute("/_authed/review")({
  loader: async () => {
    const response = await api.review.products.$get({
      query: { status: "pending" },
    })
    if (response.status === 403) {
      return { products: [] as PublicProduct[], forbidden: true }
    }
    const body = await readJson<{ products: PublicProduct[] }>(response)
    return { ...body, forbidden: false }
  },
  component: ReviewPage,
})
