import { createFileRoute } from "@tanstack/react-router"

import type { PublicProspect } from "@backend/routes/v1/prospects/lib/serialize"
import { OutreachPage } from "@features/outreach/outreach-page"
import { api, readJson } from "@lib/api"

export const Route = createFileRoute("/_authed/outreach")({
  loader: async () => {
    const response = await api.prospects.$get()
    if (response.status === 403) {
      return { prospects: [] as PublicProspect[], forbidden: true }
    }
    const body = await readJson<{ prospects: PublicProspect[] }>(response)
    return { ...body, forbidden: false }
  },
  component: OutreachPage,
})
