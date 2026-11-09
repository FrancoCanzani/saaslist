import { Link, getRouteApi } from "@tanstack/react-router"

import { PageFrame } from "@components/page-frame"

const routeApi = getRouteApi("/_authed/mine")

export function MinePage() {
  const { products } = routeApi.useLoaderData()

  return (
    <PageFrame>
    <div className="w-full space-y-8 p-4 sm:p-6">
      <h1 className="text-xl font-medium">Your products</h1>
      {products.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          Nothing submitted yet.{" "}
          <Link to="/submit" className="underline underline-offset-4">
            Submit one
          </Link>
          .
        </p>
      ) : (
        <ul className="mt-8 divide-y divide-border border-y border-border">
          {products.map((product) => (
            <li key={product.id} className="py-4">
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-lg">{product.name}</span>
                <span className="text-sm text-muted-foreground">{product.status}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{product.tagline}</p>
              {product.reviewNote ? (
                <p className="mt-2 text-sm">{product.reviewNote}</p>
              ) : null}
              {product.status === "approved" ? (
                <Link
                  to="/tools/$slug"
                  params={{ slug: product.slug }}
                  className="mt-2 inline-block text-sm underline underline-offset-4"
                >
                  Public page
                </Link>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
    </PageFrame>
  )
}
