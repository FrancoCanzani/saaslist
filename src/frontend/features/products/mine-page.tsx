import { Link, getRouteApi } from "@tanstack/react-router"

const routeApi = getRouteApi("/_authed/mine")

export function MinePage() {
  const { products } = routeApi.useLoaderData()

  return (
    <div>
      <h1 className="text-3xl tracking-tight">Your products</h1>
      {products.length === 0 ? (
        <p className="mt-4 text-muted">
          Nothing submitted yet.{" "}
          <Link to="/submit" className="underline underline-offset-4">
            Submit one
          </Link>
          .
        </p>
      ) : (
        <ul className="mt-8 divide-y divide-line border-y border-line">
          {products.map((product) => (
            <li key={product.id} className="py-4">
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-lg">{product.name}</span>
                <span className="text-sm text-muted">{product.status}</span>
              </div>
              <p className="mt-1 text-sm text-muted">{product.tagline}</p>
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
  )
}
