import { getRouteApi, useRouter } from "@tanstack/react-router"
import { useState, type FormEvent } from "react"

import { Button } from "@components/ui/button"
import { Field, SelectInput, TextArea, TextInput } from "@components/ui/field"
import { api } from "@lib/api"

const routeApi = getRouteApi("/_authed/submit")

const platformOptions = [
  ["web", "Web"],
  ["ios", "iOS"],
  ["android", "Android"],
  ["desktop", "Desktop"],
  ["api", "API"],
  ["browser_extension", "Browser extension"],
  ["other", "Other"],
] as const

export function SubmitPage() {
  const { categories } = routeApi.useLoaderData()
  const router = useRouter()
  const [category, setCategory] = useState(categories[0]?.slug ?? "")
  const [platforms, setPlatforms] = useState<string[]>(["web"])
  const [tags, setTags] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const selected = categories.find((item) => item.slug === category)

  function toggle(list: string[], value: string) {
    return list.includes(value)
      ? list.filter((item) => item !== value)
      : [...list, value]
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setPending(true)
    setError(null)
    const response = await api.products.$post({
      json: {
        name: String(form.get("name") ?? ""),
        tagline: String(form.get("tagline") ?? ""),
        description: String(form.get("description") ?? ""),
        audience: String(form.get("audience") ?? ""),
        websiteUrl: String(form.get("websiteUrl") ?? ""),
        category,
        pricingModel: String(form.get("pricingModel") ?? "free") as
          | "free"
          | "freemium"
          | "premium",
        platforms: platforms as Array<
          | "web"
          | "ios"
          | "android"
          | "desktop"
          | "api"
          | "browser_extension"
          | "other"
        >,
        tags,
      },
    })
    setPending(false)
    if (!response.ok) {
      setError("Check the fields and try again.")
      return
    }
    await router.navigate({ to: "/mine" })
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl tracking-tight">Submit a product</h1>
      <p className="mt-2 text-muted">
        It stays private until someone approves it. Software only, built
        without funding.
      </p>
      <form className="mt-8 flex flex-col gap-4" onSubmit={onSubmit}>
        <Field label="Name">
          <TextInput name="name" required minLength={3} maxLength={80} />
        </Field>
        <Field label="Tagline">
          <TextInput name="tagline" required minLength={10} maxLength={140} />
        </Field>
        <Field label="What it does">
          <TextArea name="description" required minLength={50} maxLength={1000} />
        </Field>
        <Field label="Who it is for">
          <TextInput name="audience" required minLength={10} maxLength={200} />
        </Field>
        <Field label="Website">
          <TextInput name="websiteUrl" type="url" required placeholder="https://" />
        </Field>
        <Field label="Category">
          <SelectInput
            value={category}
            onChange={(event) => {
              setCategory(event.target.value)
              setTags([])
            }}
          >
            {categories.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Pricing">
          <SelectInput name="pricingModel" defaultValue="freemium">
            <option value="free">Free</option>
            <option value="freemium">Freemium</option>
            <option value="premium">Paid</option>
          </SelectInput>
        </Field>
        <fieldset className="flex flex-col gap-2 text-sm">
          <legend className="text-muted">Platforms</legend>
          {platformOptions.map(([value, label]) => (
            <label key={value} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={platforms.includes(value)}
                onChange={() => setPlatforms((current) => toggle(current, value))}
              />
              {label}
            </label>
          ))}
        </fieldset>
        <fieldset className="flex flex-col gap-2 text-sm">
          <legend className="text-muted">Tags, up to 3</legend>
          {selected?.tags.map((tag) => (
            <label key={tag} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={tags.includes(tag)}
                onChange={() =>
                  setTags((current) =>
                    current.includes(tag)
                      ? current.filter((item) => item !== tag)
                      : current.length >= 3
                        ? current
                        : [...current, tag],
                  )
                }
              />
              {tag}
            </label>
          ))}
        </fieldset>
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <Button type="submit" disabled={pending || tags.length === 0 || platforms.length === 0}>
          {pending ? "Submitting…" : "Submit for review"}
        </Button>
      </form>
    </div>
  )
}
