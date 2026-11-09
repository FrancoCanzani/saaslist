import { createFileRoute } from "@tanstack/react-router"

import { NewsletterPage } from "@features/pages/static-pages"

export const Route = createFileRoute("/newsletter")({
  component: NewsletterPage,
})
