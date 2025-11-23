import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductActionsDropdown } from "@/features/products/components/product-actions-dropdown";
import { ProductAnalytics } from "@/features/products/components/product-analytics";
import ProductLogo from "@/features/products/components/product-logo";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "My Products | SaasList",
  description: "Manage and track your product launches on SaasList. View analytics, edit listings, and monitor performance.",
  alternates: {
    canonical: `${baseUrl}/my-products`,
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function MyProductsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const productIds = products?.map((p) => p.id) || [];
  
  let allAnalyticsData = null;
  if (products && products.length > 0) {
    const { data: allViews } = await supabase
      .from("product_views")
      .select("created_at, country, product_id")
      .in("product_id", productIds)
      .gte("created_at", thirtyDaysAgo.toISOString())
      .order("created_at", { ascending: true });

    const dailyViews = new Map<string, number>();
    const countryCounts = new Map<string, number>();

    allViews?.forEach((view) => {
      const date = new Date(view.created_at).toISOString().split("T")[0];
      dailyViews.set(date, (dailyViews.get(date) || 0) + 1);

      if (view.country) {
        countryCounts.set(view.country, (countryCounts.get(view.country) || 0) + 1);
      }
    });

    const chartData = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      const dateStr = date.toISOString().split("T")[0];
      return {
        date: dateStr,
        views: dailyViews.get(dateStr) || 0,
      };
    });

    const countryData = Array.from(countryCounts.entries())
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count);

    const analyticsByProduct: Record<string, { chartData: typeof chartData; countryData: typeof countryData; totalViews: number }> = {};

    for (const product of products) {
      const productViews = allViews?.filter((v) => v.product_id === product.id) || [];
      const productDailyViews = new Map<string, number>();
      const productCountryCounts = new Map<string, number>();

      productViews.forEach((view) => {
        const date = new Date(view.created_at).toISOString().split("T")[0];
        productDailyViews.set(date, (productDailyViews.get(date) || 0) + 1);

        if (view.country) {
          productCountryCounts.set(
            view.country,
            (productCountryCounts.get(view.country) || 0) + 1
          );
        }
      });

      const productChartData = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        const dateStr = date.toISOString().split("T")[0];
        return {
          date: dateStr,
          views: productDailyViews.get(dateStr) || 0,
        };
      });

      const productCountryData = Array.from(productCountryCounts.entries())
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count);

      analyticsByProduct[product.id] = {
        chartData: productChartData,
        countryData: productCountryData,
        totalViews: productViews.length,
      };
    }

    allAnalyticsData = {
      all: {
        chartData,
        countryData,
        totalViews: allViews?.length || 0,
      },
      byProduct: analyticsByProduct,
    };
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 w-full">
      <div>
        <h1 className="text-xl font-medium">My Products</h1>
        <h2 className="text-muted-foreground text-sm">
          Manage your product launches
        </h2>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>Failed to load products</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="products" className="w-full">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="mt-6">
          {!error && (!products || products.length === 0) ? (
            <Alert>
              <AlertDescription>
                You haven't launched any products yet.{" "}
                <Link href="/products/new" className="underline">
                  Launch your first product
                </Link>
              </AlertDescription>
            </Alert>
          ) : (
            <div>
              <div className="divide-y">
                {products?.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="size-9 flex items-center justify-center shrink-0">
                        <ProductLogo
                          logoUrl={product.logo_url}
                          productName={product.name}
                          size={28}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate">{product.name}</h3>
                        <p className="text-xs hidden sm:block text-muted-foreground truncate">
                          {product.tagline}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <ProductActionsDropdown
                        productId={product.id}
                        productName={product.name}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          {!error && products && products.length > 0 ? (
            <ProductAnalytics
              products={products.map((p) => ({ id: p.id, name: p.name }))}
              analyticsData={allAnalyticsData}
            />
          ) : (
            <Alert>
              <AlertDescription>
                You need to have at least one product to view analytics.{" "}
                <Link href="/products/new" className="underline">
                  Launch your first product
                </Link>
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
