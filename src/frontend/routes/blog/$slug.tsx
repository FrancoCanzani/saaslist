import { createFileRoute } from "@tanstack/react-router"

import { BlogPostPage } from "@features/pages/static-pages"

export const Route = createFileRoute("/blog/$slug")({
  component: BlogPostPage,
})
