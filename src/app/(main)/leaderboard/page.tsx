import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadMoreButton } from "@/features/leaderboard/components/load-more-button";
import { TimePeriodFilter } from "@/features/leaderboard/components/time-period-filter";
import ProductCard from "@/features/products/components/product-card";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import { createLoader, parseAsInteger, parseAsStringEnum } from "nuqs/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const loader = createLoader({
    period: parseAsStringEnum([
      "today",
      "week",
      "month",
      "year",
      "all",
    ]).withDefault("week"),
  });
  const { period } = await loader(searchParams);

  const periodTitles = {
    today: "Today",
    week: "This Week",
    month: "This Month",
    year: "This Year",
    all: "All Time",
  };

  const periodTitle = periodTitles[period];
  const description = `Discover the top liked SaaS products ${periodTitle.toLowerCase()}. See which products are trending and getting the most community support.`;

  return {
    title: `Top SaaS Products Leaderboard ${periodTitle} | SaasList`,
    description,
    alternates: {
      canonical: `${baseUrl}/leaderboard`,
    },
    openGraph: {
      title: `Top SaaS Products Leaderboard ${periodTitle}`,
      description,
      type: "website",
      url: `${baseUrl}/leaderboard`,
    },
    twitter: {
      card: "summary_large_image",
      title: `Top SaaS Products Leaderboard ${periodTitle}`,
      description,
    },
  };
}

const loadSearchParams = createLoader({
  period: parseAsStringEnum([
    "today",
    "week",
    "month",
    "year",
    "all",
  ]).withDefault("week"),
  page: parseAsInteger.withDefault(1),
});

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { period, page } = await loadSearchParams(searchParams);
  const limit = 50;
  const offset = (page - 1) * limit;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const now = new Date();
  let startDate: Date | null = null;

  switch (period) {
    case "today":
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case "week":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "month":
      startDate = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate(),
      );
      break;
    case "year":
      startDate = new Date(
        now.getFullYear() - 1,
        now.getMonth(),
        now.getDate(),
      );
      break;
    case "all":
      startDate = null;
      break;
  }

  let query = supabase.from("products").select(
    `
      *,
      likes!left(user_id)
    `,
    { count: "exact" },
  );

  if (startDate) {
    query = query.gte("created_at", startDate.toISOString());
  }

  const {
    data: products,
    error,
    count,
  } = await query
    .order("likes_count", { ascending: false })
    .range(offset, offset + limit - 1);

  const processedProducts =
    products?.map((product) => {
      const { likes_count, ...rest } = product;
      return {
        ...rest,
        likes_count,
        is_liked: user
          ? product.likes?.some((like: any) => like.user_id === user.id)
          : false,
      };
    }) || [];

  if (error) {
    return (
      <div className="p-8">
        <Alert>
          <AlertDescription>Error loading leaderboard</AlertDescription>
        </Alert>
      </div>
    );
  }

  const hasMore = count ? offset + limit < count : false;

  const periodTitles = {
    today: "Today",
    week: "This Week",
    month: "This Month",
    year: "This Year",
    all: "All Time",
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 w-full">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h1 className="text-xl font-medium">Leaderboard</h1>
          <h2 className="text-muted-foreground text-sm">
            Top liked products {periodTitles[period].toLowerCase()}
          </h2>
        </div>

        <TimePeriodFilter />
      </div>

      {processedProducts.length === 0 ? (
        <Alert>
          <AlertDescription className="mx-auto">
            No products found for this time period
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <div className="space-y-4 flex flex-col">
            {processedProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                position={index + 1}
              />
            ))}
          </div>
          {hasMore && <LoadMoreButton currentPage={page} />}
        </>
      )}
    </div>
  );
}
