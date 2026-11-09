import { Check } from "lucide-react"
import type { ReactNode } from "react"
import { getRouteApi, Link } from "@tanstack/react-router"

import { PageFrame } from "@components/page-frame"
import { Badge } from "@components/ui/badge"
import { Button } from "@components/ui/button"
import { Card } from "@components/ui/card"

export function Framed({ children }: { children: ReactNode }) {
  return (
    <PageFrame>
      <div className="w-full">{children}</div>
    </PageFrame>
  )
}

export function NewsletterPage() {
  return (
    <Framed>
      <main className="mx-auto max-w-2xl space-y-8 p-6 py-12">
        <div className="space-y-3 text-center">
          <h1 className="text-4xl font-medium tracking-tight">Weekly Drops</h1>
          <p className="text-sm text-muted-foreground">
            Get the best products of the week delivered to your inbox every Sunday
          </p>
        </div>
      </main>
    </Framed>
  )
}

const plans = [
  {
    name: "Daily Boost",
    price: "$5",
    period: "/ day",
    description: "Perfect for product launches and short campaigns.",
    features: [
      "Featured on homepage marquee",
      "Featured badge on your product listing",
      "Products marked as featured",
    ],
    popular: false,
  },
  {
    name: "Growth Plan",
    price: "$39",
    period: "/ month",
    description: "Best value for sustained visibility and growth.",
    features: [
      "Featured on homepage marquee",
      "Featured badge on your product listing",
      "Products marked as featured for 30 days",
    ],
    popular: true,
  },
  {
    name: "Lifetime",
    price: "$199",
    period: "once",
    description: "One-time payment for permanent premium visibility.",
    features: [
      "Permanent featured status",
      "Featured on homepage marquee",
      "Featured badge on your product listing",
      "Products always marked as featured",
    ],
    popular: false,
  },
]

export function AdvertisePage() {
  return (
    <Framed>
      <main className="mx-auto max-w-5xl space-y-8 py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl leading-tight font-medium tracking-tighter text-balance sm:text-5xl xl:leading-tight">
            Get your product seen
          </h1>
          <h2 className="text-sm text-balance text-muted-foreground md:text-base">
            Featured placement on the homepage, with the olive badge on your card.
          </h2>
        </div>
        <div className="mx-auto grid max-w-6xl gap-6 px-4 md:grid-cols-3 md:gap-8 md:px-6">
          {plans.map((plan) => (
            <Card key={plan.name} className="h-full gap-4 p-5">
              <div className="flex w-full items-center justify-between gap-2">
                <h3 className="text-lg font-medium">{plan.name}</h3>
                {plan.popular ? <Badge className="shrink-0 rounded">Popular</Badge> : null}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-medium tracking-tight md:text-4xl">
                  {plan.price}
                </span>
                <span className="text-xs text-muted-foreground md:text-sm">
                  {plan.period}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{plan.description}</p>
              <Button
                className="w-full"
                render={<Link to="/sign-in" search={{ redirect: "/advertise" }} />}
              >
                Get started
              </Button>
              <ul className="space-y-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 size-4 shrink-0" />
                    <span className="text-sm leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </main>
    </Framed>
  )
}

const posts = [
  {
    slug: "saaslist-vs-producthunt",
    title: "SaasList vs Product Hunt",
    dek: "A curated directory of bootstrapped tools, kept by a person, next to a daily launch board.",
  },
  {
    slug: "product-launch-checklist",
    title: "Product launch checklist",
    dek: "What to have ready before you submit a bootstrapped product.",
  },
] as const

export function BlogIndexPage() {
  return (
    <Framed>
      <main className="mx-auto w-full max-w-2xl space-y-8 p-6 py-12">
        <h1 className="text-4xl font-medium tracking-tight">Blog</h1>
        <ul className="space-y-6">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="text-lg font-medium hover:underline"
              >
                {post.title}
              </Link>
              <p className="mt-1 text-sm text-muted-foreground">{post.dek}</p>
            </li>
          ))}
        </ul>
      </main>
    </Framed>
  )
}

const blogPostRoute = getRouteApi("/blog/$slug")

export function BlogPostPage() {
  const { slug } = blogPostRoute.useParams()
  const post = posts.find((item) => item.slug === slug)

  return (
    <Framed>
      <main className="mx-auto w-full max-w-2xl space-y-4 p-6 py-12">
        <h1 className="text-4xl font-medium tracking-tight">
          {post?.title ?? "Note"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {post?.dek ?? "That note is not on SaasList."}
        </p>
      </main>
    </Framed>
  )
}

export function TechStacksPage() {
  return (
    <Framed>
      <main className="w-full space-y-3 p-4 sm:p-6 lg:p-8">
        <h1 className="mb-2 text-2xl font-medium">Tech Stack</h1>
        <p className="text-sm text-muted-foreground">
          Browse bootstrapped products by the tools they are built with.
        </p>
      </main>
    </Framed>
  )
}

export function PrivacyPage() {
  return (
    <Framed>
      <main className="mx-auto w-full max-w-4xl space-y-6 p-6 py-12">
        <h1 className="text-4xl font-medium tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">
          SaasList stores the email you use to sign in, the products you submit,
          and the review decision on those products. We do not sell that information.
        </p>
      </main>
    </Framed>
  )
}

export function TermsPage() {
  return (
    <Framed>
      <main className="mx-auto w-full max-w-4xl space-y-6 p-6 py-12">
        <h1 className="text-4xl font-medium tracking-tight">Terms of Service</h1>
        <p className="text-sm text-muted-foreground">
          Listings stay private until an editor approves them. Sponsored cards
          are labeled. You are responsible for the product you submit.
        </p>
      </main>
    </Framed>
  )
}
