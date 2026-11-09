import { Link, getRouteApi } from "@tanstack/react-router"
import { Search } from "lucide-react"
import { useMemo, useState } from "react"

import { Footer } from "@components/footer"
import { Header } from "@components/header"
import { ProductRows } from "@components/product-row"
import { raisedPrimaryClass } from "@components/raised-primary"
import { Button } from "@components/ui/button"
import type { PublicProduct } from "@backend/routes/v1/products/lib/serialize"

const routeApi = getRouteApi("/")

type Sort = "newest" | "likes"

function byNewest(a: PublicProduct, b: PublicProduct) {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
}

function compareProducts(sort: Sort, a: PublicProduct, b: PublicProduct) {
  switch (sort) {
    case "likes":
      if (b.likeCount !== a.likeCount) {
        return b.likeCount - a.likeCount
      }
      return byNewest(a, b)
    case "newest":
      return byNewest(a, b)
    default: {
      const exhaustive: never = sort
      return exhaustive
    }
  }
}

export function HomePage() {
  const { products, sponsored } = routeApi.useLoaderData()
  const directory = useMemo(
    () => [...sponsored, ...products],
    [products, sponsored],
  )
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState<Sort>("newest")
  const [likes, setLikes] = useState<
    Record<string, { likeCount: number; liked: boolean }>
  >({})

  const visible = directory
    .map((product) => {
      const next = likes[product.id]
      return next ? { ...product, ...next } : product
    })
    .filter((product) => {
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
    .sort((a, b) => compareProducts(sort, a, b))

  return (
    <div className="mx-auto min-h-screen">
      <Header />

      <div className="mx-auto max-w-3xl px-6 pt-14 pb-10">
        <h1 className="font-mono text-4xl leading-none font-extralight tracking-tighter text-balance sm:text-5xl">
          A curated directory of bootstrapped SaaS
        </h1>
        <p className="mt-5 max-w-xl text-sm text-muted-foreground sm:text-base">
          Discover products built by independent founders. No funding, no
          noise, just simple, founder-built tools.
        </p>

        <label className="mt-8 flex items-center gap-3 rounded-xl border bg-background px-3 py-2.5 shadow-xs">
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
      </div>

      <main className="mx-auto max-w-3xl px-6 pb-20">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-sm font-medium">Directory</h2>
          <div className="flex items-center gap-4 text-sm">
            <button
              type="button"
              className={sort === "newest" ? "text-foreground" : "text-muted-foreground"}
              onClick={() => setSort("newest")}
            >
              Newest
            </button>
            <button
              type="button"
              className={sort === "likes" ? "text-foreground" : "text-muted-foreground"}
              onClick={() => setSort("likes")}
            >
              Most liked
            </button>
          </div>
        </div>
        <ProductRows
          products={visible}
          onLike={(id, next) => {
            setLikes((current) => ({ ...current, [id]: next }))
          }}
        />
      </main>

      <Footer />
    </div>
  )
}
