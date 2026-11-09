import { getRouteApi } from "@tanstack/react-router"

import { PageFrame } from "@components/page-frame"
import { ProductRows } from "@components/product-row"
import { Badge } from "@components/ui/badge"

const routeApi = getRouteApi("/categories/$slug")

export function CategoryPage() {
  const { category, products, sponsored } = routeApi.useLoaderData()
  const directory = [...sponsored, ...products]

  return (
    <PageFrame>
      <div className="w-full space-y-6 p-4 sm:p-6 lg:p-8">
        <div>
          <h1 className="mb-2 text-2xl font-medium">{category.name}</h1>
          <p className="text-sm text-muted-foreground">{category.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {category.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <ProductRows products={directory} />
      </div>
    </PageFrame>
  )
}
