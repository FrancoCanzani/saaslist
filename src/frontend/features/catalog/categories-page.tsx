import { Link, getRouteApi } from "@tanstack/react-router"

const routeApi = getRouteApi("/categories/")

export function CategoriesPage() {
  const { categories } = routeApi.useLoaderData()

  return (
    <div>
      <h1 className="text-3xl tracking-tight">Categories</h1>
      <p className="mt-2 text-muted">
        Each category is a list of bootstrapped tools that passed review.
      </p>
      <ul className="mt-8 divide-y divide-line border-y border-line">
        {categories.map((category) => (
          <li key={category.slug}>
            <Link
              to="/categories/$slug"
              params={{ slug: category.slug }}
              className="flex items-baseline justify-between gap-4 py-4"
            >
              <span>
                <span className="text-lg">{category.name}</span>
                <span className="mt-1 block text-sm text-muted">
                  {category.description}
                </span>
              </span>
              <span className="text-sm text-muted">{category.count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
