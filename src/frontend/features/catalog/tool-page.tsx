import { Link, getRouteApi } from "@tanstack/react-router"
import { ArrowUpRight } from "lucide-react"

import { PageFrame } from "@components/page-frame"
import { ProductLogo } from "@components/product-logo"
import { Badge } from "@components/ui/badge"
import { Button } from "@components/ui/button"

const routeApi = getRouteApi("/tools/$slug")

function launchedAgo(iso: string) {
  const elapsed = Date.now() - new Date(iso).getTime()
  const minutes = Math.max(1, Math.round(elapsed / 60000))
  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`
  }
  const hours = Math.round(minutes / 60)
  if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`
  }
  const days = Math.round(hours / 24)
  if (days < 30) {
    return `${days} day${days === 1 ? "" : "s"} ago`
  }
  const months = Math.round(days / 30)
  if (months < 12) {
    return `${months} month${months === 1 ? "" : "s"} ago`
  }
  const years = Math.round(months / 12)
  return `${years} year${years === 1 ? "" : "s"} ago`
}

export function ToolPage() {
  const { product } = routeApi.useLoaderData()

  return (
    <PageFrame>
      <div className="w-full space-y-8 p-4 sm:p-6">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center gap-x-4">
            <ProductLogo productName={product.name} size="lg" />
            <div className="flex-1">
              <h1 className="text-xl font-medium xl:text-2xl">{product.name}</h1>
              <h2 className="text-sm text-muted-foreground">{product.tagline}</h2>
            </div>
            <div className="hidden items-center justify-end space-x-1.5 xl:flex">
              <Button
                variant="secondary"
                size="xs"
                className="rounded-xl font-medium"
                render={
                  <a
                    href={product.websiteUrl}
                    target="_blank"
                    rel={product.sponsored ? "sponsored noopener" : "noopener"}
                  />
                }
              >
                Visit
                <ArrowUpRight className="size-3.5" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-x-1 text-sm font-medium">
            <span>Launched</span>
            <span>{launchedAgo(product.createdAt)}</span>
            <span>by</span>
            <span className="underline">{product.founderName}</span>
          </div>

          <div className="flex items-center justify-start space-x-1.5 xl:hidden">
            <Button
              variant="secondary"
              size="sm"
              className="rounded-xl font-medium"
              render={
                <a
                  href={product.websiteUrl}
                  target="_blank"
                  rel={product.sponsored ? "sponsored noopener" : "noopener"}
                />
              }
            >
              Visit
              <ArrowUpRight className="size-3.5" />
            </Button>
          </div>

          <p className="text-sm text-pretty text-muted-foreground">
            {product.description}
          </p>

          <div>
            <h4 className="mb-1.5 text-sm font-medium">Tags</h4>
            <div className="flex flex-wrap gap-1.5">
              <Link to="/categories/$slug" params={{ slug: product.category }}>
                <Badge className="hover:underline" variant="secondary">
                  {product.categoryName}
                </Badge>
              </Link>
              {product.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageFrame>
  )
}
