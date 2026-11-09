import { Link, getRouteApi } from "@tanstack/react-router"

import { PageFrame } from "@components/page-frame"

const routeApi = getRouteApi("/categories/")

export function CategoriesPage() {
  const { categories } = routeApi.useLoaderData()

  return (
    <PageFrame>
      <div className="w-full space-y-6 p-4 sm:p-6 lg:p-8">
        <div>
          <h1 className="mb-2 text-2xl font-medium">Browse by Categories</h1>
          <p className="text-sm text-muted-foreground">
            Explore products organized by categories and tags
          </p>
        </div>

        <div className="space-y-8">
          {categories.map((category) => (
            <div key={category.slug} className="space-y-3">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-medium">{category.name}</h2>
                <Link
                  to="/categories/$slug"
                  params={{ slug: category.slug }}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  View all →
                </Link>
              </div>
              {category.description ? (
                <p className="text-sm text-muted-foreground">
                  {category.description}
                </p>
              ) : null}
              <div className="flex flex-wrap gap-2">
                {category.tags.map((tag) => (
                  <Link
                    key={tag}
                    to="/categories/$slug"
                    params={{ slug: category.slug }}
                    className="text-sm hover:underline"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageFrame>
  )
}
