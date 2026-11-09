import { createFileRoute } from "@tanstack/react-router"

import { AdvertisePage } from "@features/pages/static-pages"

export const Route = createFileRoute("/advertise")({
  component: AdvertisePage,
})
