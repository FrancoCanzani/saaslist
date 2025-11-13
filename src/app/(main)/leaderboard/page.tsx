import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadMoreButton } from "@/features/leaderboard/load-more-button";
import { TimePeriodFilter } from "@/features/leaderboard/time-period-filter";
import ProductGrid from "@/features/products/components/product-grid";
import { createClient } from "@/utils/supabase/server";
import { createLoader, parseAsInteger, parseAsStringEnum } from "nuqs/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

  // Calculate date range based on period
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
      upvotes!left(user_id)
    `,
    { count: "exact" },
  );

  // Add date filter if applicable
  if (startDate) {
    query = query.gte("created_at", startDate.toISOString());
  }

  // Execute query with ordering and pagination
  const {
    data: products,
    error,
    count,
  } = await query
    .order("upvotes_count", { ascending: false })
    .range(offset, offset + limit - 1);

  const processedProducts =
    products?.map((product) => ({
      ...product,
      is_upvoted: user
        ? product.upvotes?.some((upvote: any) => upvote.user_id === user.id)
        : false,
    })) || [];

  if (error) {
    return (
      <div className="p-8">
        <Alert>
          <AlertDescription>Error loading leaderboard</AlertDescription>
        </Alert>
      </div>
    );
  }

  const totalProducts = processedProducts.length;
  const gridCols = 2;
  const remainder = totalProducts % gridCols;
  const emptyCells = remainder === 0 ? 0 : gridCols - remainder;
  const hasMore = count ? offset + limit < count : false;

  const periodTitles = {
    today: "Today",
    week: "This Week",
    month: "This Month",
    year: "This Year",
    all: "All Time",
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h1 className="text-xl font-medium">Leaderboard</h1>
          <h2 className="text-muted-foreground text-sm">
            Top upvoted products {periodTitles[period].toLowerCase()}
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
          <ProductGrid products={processedProducts} />

          {hasMore && <LoadMoreButton currentPage={page} />}
        </>
      )}
    </div>
  );
}
