import { Link, getRouteApi } from "@tanstack/react-router"
import { Search } from "lucide-react"
import { useMemo, useState } from "react"

import { Footer } from "@components/footer"
import { Header } from "@components/header"
import { ProductRows } from "@components/product-row"
import { raisedPrimaryClass } from "@components/raised-primary"
import { Button } from "@components/ui/button"

const routeApi = getRouteApi("/")

export function HomePage() {
  const { products, sponsored } = routeApi.useLoaderData()
  const directory = useMemo(
    () => [...sponsored, ...products],
    [products, sponsored],
  )
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<string | null>(null)

  const categories = useMemo(() => {
    const seen = new Map<string, string>()
    for (const product of directory) {
      seen.set(product.category, product.categoryName)
    }
    return [...seen.entries()].map(([slug, name]) => ({ slug, name }))
  }, [directory])

  const visible = directory.filter((product) => {
    if (category && product.category !== category) {
      return false
    }
    const needle = query.trim().toLowerCase()
    if (!needle) {
      return true
    }
    return (
      product.name.toLowerCase().includes(needle) ||
      product.tagline.toLowerCase().includes(needle) ||
      product.categoryName.toLowerCase().includes(needle)
    )
  })

  return (
    <div className="mx-auto min-h-screen">
      <Header />

      <div className="mx-auto max-w-3xl px-6 pt-10 pb-8">
        <h1 className="font-mono text-4xl leading-none font-extralight tracking-tighter text-balance sm:text-5xl">
          A curated directory of bootstrapped SaaS
        </h1>
        <p className="mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
          Discover products built by independent founders. No funding, no
          noise, just simple, founder-built tools.
        </p>

        <label className="mt-6 flex items-center gap-3 rounded-xl border bg-background px-3 py-2 shadow-xs">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search bootstrapped tools"
            className="h-8 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <Button
            size="xs"
            className={raisedPrimaryClass}
            render={<Link to="/submit" />}
          >
            Submit
          </Button>
        </label>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          <button
            type="button"
            className={category === null ? "text-foreground" : "text-muted-foreground"}
            onClick={() => setCategory(null)}
          >
            All
          </button>
          {categories.map((item) => (
            <button
              key={item.slug}
              type="button"
              className={
                category === item.slug
                  ? "text-foreground"
                  : "text-muted-foreground"
              }
              onClick={() => setCategory(item.slug)}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      <main className="mx-auto max-w-3xl px-6 pb-16">
        <h2 className="mb-3 text-sm font-medium">Directory</h2>
        <ProductRows products={visible} />
      </main>

      <Footer />
    </div>
  )
}
