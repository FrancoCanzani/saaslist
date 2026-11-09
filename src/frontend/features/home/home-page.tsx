import { Link, getRouteApi } from "@tanstack/react-router"
import { ArrowDown, ArrowRight } from "lucide-react"

import { Footer } from "@components/footer"
import { Header } from "@components/header"
import { ProductGrid } from "@components/product-card"
import {
  raisedPrimaryClass,
  raisedSecondaryClass,
} from "@components/raised-primary"
import { Button } from "@components/ui/button"

const routeApi = getRouteApi("/")

export function HomePage() {
  const { products, sponsored } = routeApi.useLoaderData()

  return (
    <div className="mx-auto min-h-screen">
      <Header />

      <div className="mx-auto max-w-7xl p-6 lg:px-12 lg:pb-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="hidden flex-col gap-4 lg:flex">
            <Link to="/" className="font-mono text-3xl leading-none font-medium">
              SaasList
            </Link>
            <ArrowDown className="text-muted-foreground hover:text-black dark:hover:text-white" />
          </div>

          <div className="flex flex-col">
            <h1 className="font-mono text-5xl leading-none font-extralight tracking-tighter text-balance sm:text-6xl xl:text-7xl">
              A curated directory of bootstrapped SaaS
            </h1>

            <p className="mt-6 max-w-2xl text-sm text-balance text-muted-foreground sm:text-lg lg:text-pretty">
              Discover products built by independent founders. No funding, no
              noise, just simple, founder-built tools.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 lg:hidden">
              <Button
                asChild
                size="lg"
                className={`rounded-xl ${raisedPrimaryClass}`}
              >
                <Link to="/submit">Submit a product</Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                size="lg"
                className={raisedSecondaryClass}
              >
                <Link to="/">Browse the directory</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-12">
        <ProductGrid products={[...sponsored, ...products]} />
      </main>

      <div className="flex w-full items-center justify-center py-12 text-sm">
        <Link to="/categories" className="group">
          <span className="flex items-center gap-1 text-muted-foreground capitalize transition-colors group-hover:text-foreground">
            Browse the directory
            <ArrowRight className="size-3 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
          </span>
        </Link>
      </div>
      <Footer />
    </div>
  )
}
