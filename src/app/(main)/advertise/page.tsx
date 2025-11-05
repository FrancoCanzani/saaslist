import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowUpRight,
  BarChart3,
  Megaphone,
  Mail,
  TrendingUp,
  Target,
  Zap,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export default async function AdvertisePage() {
  return (
    <main className="p-6 space-y-16 max-w-4xl mx-auto py-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <Badge variant="outline" className="text-xs">
          High-Intent Placements
        </Badge>
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight leading-tight">
          Get Attention from SaaS Buyers
        </h1>
        <p className="text-pretty text-base text-muted-foreground max-w-2xl mx-auto">
          We don't sell "ads." We sell attention to SaaS buyers. Every placement
          is native, contextual, and trackable—designed for founders who want
          lead generation, launch visibility, and category dominance.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-blue-600" />
            <span>Native placements</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-blue-600" />
            <span>Contextual targeting</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-blue-600" />
            <span>Full analytics</span>
          </div>
        </div>
      </div>

      {/* Ad Products */}
      <div className="space-y-12">
        {/* Featured Listings */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl" />
          <CardHeader className="relative">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Zap className="size-5 text-blue-600" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Most Popular
                  </Badge>
                </div>
                <CardTitle className="text-2xl">Featured Listings</CardTitle>
                <CardDescription className="text-base">
                  Highlighted at the top of category pages and homepage
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-medium">$99–$299</div>
                <div className="text-xs text-muted-foreground">per week</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 relative">
            <div className="space-y-3">
              <h3 className="font-medium text-sm flex items-center gap-2">
                <Target className="size-4 text-blue-600" />
                What You Get
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-blue-600 mt-0.5 shrink-0" />
                  <span>
                    Prominent placement at the top of category pages and
                    homepage
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-blue-600 mt-0.5 shrink-0" />
                  <span>
                    Labeled as "Sponsored" or "Featured SaaS" for transparency
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-blue-600 mt-0.5 shrink-0" />
                  <span>Enhanced visuals, badges, and CTA buttons</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-blue-600 mt-0.5 shrink-0" />
                  <span>
                    Rotating or capped slots (e.g., only 5 per category)
                  </span>
                </li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Why it sells:</strong>{" "}
                Founders pay for exposure right when they launch. Perfect for
                new products looking to capture early adopters and generate
                immediate visibility.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Category Sponsorships */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl" />
          <CardHeader className="relative">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <TrendingUp className="size-5 text-blue-600" />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Premium
                  </Badge>
                </div>
                <CardTitle className="text-2xl">Category Sponsorships</CardTitle>
                <CardDescription className="text-base">
                  Own a category and position your brand as the leader
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-medium">$500–$2,000</div>
                <div className="text-xs text-muted-foreground">per month</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 relative">
            <div className="space-y-3">
              <h3 className="font-medium text-sm flex items-center gap-2">
                <Target className="size-4 text-blue-600" />
                What You Get
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-blue-600 mt-0.5 shrink-0" />
                  <span>
                    Category ownership with "Sponsored by [Your Brand]" at the
                    top
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-blue-600 mt-0.5 shrink-0" />
                  <span>
                    Logo + short text blurb prominently displayed on category
                    page
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-blue-600 mt-0.5 shrink-0" />
                  <span>
                    One newsletter mention per week in that category's digest
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-blue-600 mt-0.5 shrink-0" />
                  <span>
                    Analytics dashboard showing impressions, clicks, and
                    conversions
                  </span>
                </li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Why it sells:</strong>{" "}
                Positioning power for established SaaS companies or agencies.
                Own "Best AI Tools," "Top CRM," or any category. Perfect for
                category dominance and long-term brand building.
              </p>
            </div>
            <div className="text-xs text-muted-foreground italic">
              Examples: "Sponsored by Pipedream" (Developer Tools), "Sponsored
              by Notion" (Productivity Tools)
            </div>
          </CardContent>
        </Card>

        {/* Newsletter Placements */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl" />
          <CardHeader className="relative">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Mail className="size-5 text-blue-600" />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Newsletter
                  </Badge>
                </div>
                <CardTitle className="text-2xl">Newsletter Placements</CardTitle>
                <CardDescription className="text-base">
                  Reach engaged SaaS founders in our weekly digest
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-medium">$200–$800</div>
                <div className="text-xs text-muted-foreground">per issue</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 relative">
            <div className="space-y-3">
              <h3 className="font-medium text-sm flex items-center gap-2">
                <Target className="size-4 text-blue-600" />
                What You Get
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-blue-600 mt-0.5 shrink-0" />
                  <span>
                    1–2 sponsor slots in our weekly "Top SaaS Launches"
                    newsletter
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-blue-600 mt-0.5 shrink-0" />
                  <span>Banner or native paragraph ad placement</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-blue-600 mt-0.5 shrink-0" />
                  <span>Direct links to your product or landing page</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-blue-600 mt-0.5 shrink-0" />
                  <span>Open and click tracking analytics</span>
                </li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Why it sells:</strong>{" "}
                Newsletters convert—founders love measurable ROI. Our audience
                actively reads to discover new tools, so your message reaches
                high-intent buyers at the perfect moment.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-muted border border-dashed">
              <p className="text-xs text-muted-foreground italic">
                Example: "🎯 Sponsored: Automate your SaaS billing with Paddle
                — free for startups."
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strategy Section */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-medium tracking-tight">
            Our Ad Strategy
          </h2>
          <p className="text-sm text-muted-foreground">
            What makes us different from traditional ad platforms
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <div className="p-2 rounded-lg bg-blue-500/10 w-fit mb-2">
                <Target className="size-5 text-blue-600" />
              </div>
              <CardTitle className="text-lg">High-Intent Discovery</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We're not just a directory. We're a discovery platform where SaaS
                buyers actively search for solutions. Your ads reach people who
                are ready to buy.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="p-2 rounded-lg bg-blue-500/10 w-fit mb-2">
                <BarChart3 className="size-5 text-blue-600" />
              </div>
              <CardTitle className="text-lg">What Advertisers Care About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Lead generation, launch visibility, and category dominance.
                Every placement is designed to deliver measurable results, not
                just impressions.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="p-2 rounded-lg bg-blue-500/10 w-fit mb-2">
                <Megaphone className="size-5 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Native & Contextual</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Every placement feels native and contextual. No banner blindness.
                No intrusive popups. Just seamless integration that respects
                your audience.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10 border-blue-200 dark:border-blue-800">
        <CardContent className="p-8 text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-medium tracking-tight">
              Ready to Reach SaaS Buyers?
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              Get in touch to discuss placements, pricing, and how we can help
              you achieve your goals—whether that's lead generation, launch
              visibility, or category dominance.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              asChild
              size="lg"
              className="text-white leading-none bg-linear-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-500/40"
            >
              <Link href="mailto:advertise@saaslist.com">
                Get in Touch
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/browse">See Our Categories</Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Interested in custom placements? We offer flexible packages tailored
            to your needs.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

