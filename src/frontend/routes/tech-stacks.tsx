import { createFileRoute } from "@tanstack/react-router"

import { TechStacksPage } from "@features/pages/static-pages"

export const Route = createFileRoute("/tech-stacks")({
  component: TechStacksPage,
})
