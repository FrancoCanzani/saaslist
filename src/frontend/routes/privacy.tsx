import { createFileRoute } from "@tanstack/react-router"

import { PrivacyPage } from "@features/pages/static-pages"

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
})
