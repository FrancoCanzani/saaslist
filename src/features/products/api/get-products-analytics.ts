import { createClient } from "@/lib/supabase/server";
import { cache } from "react";

interface ProductWithStats {
  id: string;
  name: string;
  logo_url: string | null;
  created_at: string;
  likes_count: number;
  comments_count: number;
  reviews_count: number;
}

interface ProductView {
  id: string;
  created_at: string;
  country: string | null;
  city: string | null;
  region: string | null;
  device: string | null;
  product_id: string;
}

interface ProductAnalytics {
  id: string;
  name: string;
  logoUrl: string | null;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  reviewsCount: number;
  views7Days: number;
  views30Days: number;
  chartData: Array<{ date: string; views: number }>;
  countryData: Array<{ country: string; count: number; percentage: number }>;
}

export interface AnalyticsData {
  overview: {
    totalViewsAllTime: number;
    viewsLast7Days: number;
    viewsLast30Days: number;
    trendPercentage: number;
    totalProducts: number;
    totalLikes: number;
    totalComments: number;
    totalReviews: number;
  };
  chartData: Array<{ date: string; views: number }>;
  countryData: Array<{ country: string; count: number; percentage: number }>;
  cityData: Array<{ city: string; count: number }>;
  hourlyData: Array<{ hour: number; views: number }>;
  dayOfWeekData: Array<{ day: string; views: number }>;
  deviceData: Array<{ device: string; count: number; percentage: number }>;
  productAnalytics: ProductAnalytics[];
}

export const getProductsAnalytics = cache(
  async (userId: string): Promise<AnalyticsData | null> => {
    const supabase = await createClient();

    const { data: products, error: productsError } = await supabase
      .from("products")
      .select(
        "id, name, logo_url, created_at, likes_count, comments_count, reviews_count"
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (productsError || !products || products.length === 0) {
      return null;
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const productIds = products.map((p) => p.id);

    const { data: allViews } = await supabase
      .from("product_views")
      .select("id, created_at, country, city, region, device, product_id")
      .in("product_id", productIds)
      .gte("created_at", thirtyDaysAgo.toISOString())
      .order("created_at", { ascending: true });

    const { count: totalViewsAllTime } = await supabase
      .from("product_views")
      .select("id", { count: "exact", head: true })
      .in("product_id", productIds);

    const dailyViews = new Map<string, number>();
    const countryCounts = new Map<string, number>();
    const cityCounts = new Map<string, number>();
    const deviceCounts = new Map<string, number>();
    const hourlyDistribution = new Map<number, number>();
    const dayOfWeekDistribution = new Map<number, number>();

    let viewsLast7Days = 0;
    const viewsLast30Days = allViews?.length || 0;

    allViews?.forEach((view: ProductView) => {
      const date = new Date(view.created_at);
      const dateStr = date.toISOString().split("T")[0];
      dailyViews.set(dateStr, (dailyViews.get(dateStr) || 0) + 1);

      if (date >= sevenDaysAgo) {
        viewsLast7Days++;
      }

      if (view.country) {
        countryCounts.set(
          view.country,
          (countryCounts.get(view.country) || 0) + 1
        );
      }
      if (view.city) {
        cityCounts.set(view.city, (cityCounts.get(view.city) || 0) + 1);
      }
      if (view.device) {
        deviceCounts.set(view.device, (deviceCounts.get(view.device) || 0) + 1);
      }

      const hour = date.getHours();
      hourlyDistribution.set(hour, (hourlyDistribution.get(hour) || 0) + 1);

      const dayOfWeek = date.getDay();
      dayOfWeekDistribution.set(
        dayOfWeek,
        (dayOfWeekDistribution.get(dayOfWeek) || 0) + 1
      );
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

    const previousSevenDaysAgo = new Date();
    previousSevenDaysAgo.setDate(previousSevenDaysAgo.getDate() - 14);

    let viewsPrevious7Days = 0;
    allViews?.forEach((view: ProductView) => {
      const date = new Date(view.created_at);
      if (date >= previousSevenDaysAgo && date < sevenDaysAgo) {
        viewsPrevious7Days++;
      }
    });

    const trendPercentage =
      viewsPrevious7Days > 0
        ? Math.round(
            ((viewsLast7Days - viewsPrevious7Days) / viewsPrevious7Days) * 100
          )
        : viewsLast7Days > 0
          ? 100
          : 0;

    const countryData = Array.from(countryCounts.entries())
      .map(([country, count]) => ({
        country,
        count,
        percentage: viewsLast30Days > 0 ? (count / viewsLast30Days) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count);

    const cityData = Array.from(cityCounts.entries())
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const deviceData = Array.from(deviceCounts.entries())
      .map(([device, count]) => ({
        device,
        count,
        percentage: viewsLast30Days > 0 ? (count / viewsLast30Days) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count);

    const hourlyData = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      views: hourlyDistribution.get(hour) || 0,
    }));

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayOfWeekData = Array.from({ length: 7 }, (_, day) => ({
      day: dayNames[day],
      views: dayOfWeekDistribution.get(day) || 0,
    }));

    const productAnalytics = products.map((product: ProductWithStats) => {
      const productViews =
        allViews?.filter((v: ProductView) => v.product_id === product.id) || [];
      const productDailyViews = new Map<string, number>();
      const productCountryCounts = new Map<string, number>();

      let productViews7Days = 0;
      const productViews30Days = productViews.length;

      productViews.forEach((view: ProductView) => {
        const date = new Date(view.created_at);
        const dateStr = date.toISOString().split("T")[0];
        productDailyViews.set(
          dateStr,
          (productDailyViews.get(dateStr) || 0) + 1
        );

        if (date >= sevenDaysAgo) {
          productViews7Days++;
        }

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
        .map(([country, count]) => ({
          country,
          count,
          percentage:
            productViews30Days > 0 ? (count / productViews30Days) * 100 : 0,
        }))
        .sort((a, b) => b.count - a.count);

      return {
        id: product.id,
        name: product.name,
        logoUrl: product.logo_url,
        createdAt: product.created_at,
        likesCount: product.likes_count,
        commentsCount: product.comments_count,
        reviewsCount: product.reviews_count,
        views7Days: productViews7Days,
        views30Days: productViews30Days,
        chartData: productChartData,
        countryData: productCountryData,
      };
    });

    return {
      overview: {
        totalViewsAllTime: totalViewsAllTime || 0,
        viewsLast7Days,
        viewsLast30Days,
        trendPercentage,
        totalProducts: products.length,
        totalLikes: products.reduce(
          (sum, p: ProductWithStats) => sum + (p.likes_count || 0),
          0
        ),
        totalComments: products.reduce(
          (sum, p: ProductWithStats) => sum + (p.comments_count || 0),
          0
        ),
        totalReviews: products.reduce(
          (sum, p: ProductWithStats) => sum + (p.reviews_count || 0),
          0
        ),
      },
      chartData,
      countryData,
      cityData,
      hourlyData,
      dayOfWeekData,
      deviceData,
      productAnalytics,
    };
  }
);

