import { hc } from "hono/client"
import { notFound } from "@tanstack/react-router"

import type { V1Api } from "@backend/api"

export const api = hc<V1Api>("/api/v1", {
  init: {
    credentials: "include",
  },
})

type JsonResponse = {
  ok: boolean
  status: number
  json: () => Promise<unknown>
}

export async function readJson<T>(response: JsonResponse): Promise<T> {
  if (response.status === 404) {
    throw notFound()
  }
  if (!response.ok) {
    throw new Error("Request failed")
  }
  return response.json() as Promise<T>
}
