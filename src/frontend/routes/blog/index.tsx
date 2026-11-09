import { createFileRoute } from "@tanstack/react-router"

import { BlogIndexPage } from "@features/pages/static-pages"

export const Route = createFileRoute("/blog/")({
  component: BlogIndexPage,
})
