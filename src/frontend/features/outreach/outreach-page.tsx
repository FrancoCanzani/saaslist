import { getRouteApi, useRouter } from "@tanstack/react-router"
import { useState, type FormEvent } from "react"

import { PageFrame } from "@components/page-frame"
import { Button } from "@components/ui/button"
import { Field, TextInput } from "@components/ui/field"
import { api } from "@lib/api"

const routeApi = getRouteApi("/_authed/outreach")

export function OutreachPage() {
  const { prospects, forbidden } = routeApi.useLoaderData()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function addProspect(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setPending(true)
    setError(null)
    const response = await api.prospects.$post({
      json: {
        source: String(form.get("source") ?? ""),
        sourceUrl: String(form.get("sourceUrl") ?? ""),
        productName: String(form.get("productName") ?? ""),
        websiteUrl: String(form.get("websiteUrl") ?? ""),
        contactEmail: String(form.get("contactEmail") ?? ""),
        tagline: String(form.get("tagline") ?? "") || undefined,
      },
    })
    setPending(false)
    if (!response.ok) {
      setError(
        response.status === 409
          ? "That listing URL is already in the queue."
          : "Could not add that company.",
      )
      return
    }
    event.currentTarget.reset()
    await router.invalidate()
  }

  async function act(
    id: string,
    action: "ready" | "skip" | "send" | "replied" | "listed",
  ) {
    setError(null)
    const response = await api.prospects[":id"].$post({
      param: { id },
      json: { action },
    })
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as {
        error?: string
      } | null
      setError(body?.error ?? "Could not update that prospect.")
      return
    }
    await router.invalidate()
  }

  return (
    <PageFrame>
    <div className="w-full space-y-8 p-4 sm:p-6">
      <div>
        <h1 className="text-xl font-medium">Outreach</h1>
        <p className="max-w-xl text-sm text-muted-foreground">
          Add a company you saw on another board. Mark it ready, then send one
          email. Nothing here is published until you approve a listing.
        </p>
      </div>
      {forbidden ? (
        <p className="text-sm text-muted-foreground">Only editors can use the outreach desk.</p>
      ) : (
      <>
      <form
        className="grid gap-4 rounded-lg border border-border bg-card p-4 sm:grid-cols-2"
        onSubmit={addProspect}
      >
        <Field label="Product">
          <TextInput name="productName" required />
        </Field>
        <Field label="Where you saw it">
          <TextInput name="source" required placeholder="Product Hunt" />
        </Field>
        <Field label="Listing URL">
          <TextInput name="sourceUrl" type="url" required />
        </Field>
        <Field label="Website">
          <TextInput name="websiteUrl" type="url" required />
        </Field>
        <Field label="Public email">
          <TextInput name="contactEmail" type="email" required />
        </Field>
        <Field label="Tagline">
          <TextInput name="tagline" />
        </Field>
        <div className="sm:col-span-2">
          {error ? <p className="mb-3 text-sm text-destructive">{error}</p> : null}
          <Button type="submit" disabled={pending}>
            {pending ? "Adding…" : "Add to queue"}
          </Button>
        </div>
      </form>
      <ul className="divide-y divide-border border-y border-border">
        {prospects.map((item) => (
          <li key={item.id} className="py-4">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-lg">{item.productName}</h2>
              <span className="text-sm text-muted-foreground">{item.status}</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {item.source} · {item.contactEmail}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {item.status === "new" ? (
                <Button variant="secondary" onClick={() => void act(item.id, "ready")}>
                  Mark ready
                </Button>
              ) : null}
              {item.status === "ready" ? (
                <Button onClick={() => void act(item.id, "send")}>
                  Send email
                </Button>
              ) : null}
              {item.status === "new" || item.status === "ready" ? (
                <Button variant="secondary" onClick={() => void act(item.id, "skip")}>
                  Skip
                </Button>
              ) : null}
              {item.status === "emailed" ? (
                <Button variant="secondary" onClick={() => void act(item.id, "replied")}>
                  They replied
                </Button>
              ) : null}
              {item.status === "emailed" || item.status === "replied" ? (
                <Button variant="secondary" onClick={() => void act(item.id, "listed")}>
                  Listed
                </Button>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
      </>
      )}
    </div>
    </PageFrame>
  )
}
