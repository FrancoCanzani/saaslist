import { getRouteApi, useRouter } from "@tanstack/react-router"
import { useState } from "react"

import { Button } from "@components/ui/button"
import { api } from "@lib/api"

const routeApi = getRouteApi("/_authed/review")

export function ReviewPage() {
  const { products, forbidden } = routeApi.useLoaderData()
  const router = useRouter()
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function decide(id: string, decision: "approve" | "reject") {
    setPendingId(id)
    setError(null)
    const response = await api.review.products[":id"].$post({
      param: { id },
      json: { decision },
    })
    setPendingId(null)
    if (!response.ok) {
      setError("Could not update that product.")
      return
    }
    await router.invalidate()
  }

  return (
    <div>
      <h1 className="text-3xl tracking-tight">Review</h1>
      <p className="mt-2 text-muted">
        Approve software from independent teams. Reject everything else.
      </p>
      {forbidden ? (
        <p className="mt-8 text-muted">Only editors can review submissions.</p>
      ) : null}
      {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
      {!forbidden && products.length === 0 ? (
        <p className="mt-8 text-muted">The queue is empty.</p>
      ) : null}
      {!forbidden && products.length > 0 ? (
        <ul className="mt-8 divide-y divide-line border-y border-line">
          {products.map((product) => (
            <li key={product.id} className="py-5">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-lg">{product.name}</h2>
                <span className="text-sm text-muted">{product.categoryName}</span>
              </div>
              <p className="mt-1 text-sm">{product.tagline}</p>
              <p className="mt-3 text-sm leading-6 text-muted">
                {product.description}
              </p>
              <p className="mt-2 text-sm">For {product.audience}</p>
              <a
                href={product.websiteUrl}
                className="mt-2 inline-block text-sm underline underline-offset-4"
                target="_blank"
                rel="noopener noreferrer"
              >
                {product.websiteUrl}
              </a>
              <div className="mt-4 flex gap-2">
                <Button
                  disabled={pendingId === product.id}
                  onClick={() => void decide(product.id, "approve")}
                >
                  Approve
                </Button>
                <Button
                  variant="danger"
                  disabled={pendingId === product.id}
                  onClick={() => void decide(product.id, "reject")}
                >
                  Reject
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
