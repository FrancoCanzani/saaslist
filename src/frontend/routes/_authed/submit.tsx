import { createFileRoute } from "@tanstack/react-router"

import { SubmitPage } from "@features/products/submit-page"
import { api, readJson } from "@lib/api"

export const Route = createFileRoute("/_authed/submit")({
  loader: async () => {
    const response = await api.categories.$get()
    return readJson<{
      categories: Array<{
        slug: string
        name: string
        description: string
        tags: string[]
        count: number
      }>
    }>(response)
  },
  component: SubmitPage,
})
