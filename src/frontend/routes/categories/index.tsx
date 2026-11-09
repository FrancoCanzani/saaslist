import { createFileRoute } from "@tanstack/react-router"

import { CategoriesPage } from "@features/catalog/categories-page"
import { api, readJson } from "@lib/api"

export const Route = createFileRoute("/categories/")({
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
  component: CategoriesPage,
})
