"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCountryDisplay } from "@/utils/constants/countries";
import { parseAsString, useQueryState } from "nuqs";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  MessageSquare,
  Star,
  Globe,
  Clock,
  Monitor,
  Smartphone,
  Tablet,
} from "lucide-react";
import ProductLogo from "./product-logo";

function getDeviceIcon(device: string) {
  switch (device) {
    case "desktop":
      return <Monitor className="size-4" />;
    case "mobile":
      return <Smartphone className="size-4" />;
    case "tablet":
      return <Tablet className="size-4" />;
    default:
      return <Monitor className="size-4" />;
  }
}

function getDeviceLabel(device: string): string {
  switch (device) {
    case "desktop":
      return "Desktop";
    case "mobile":
      return "Mobile";
    case "tablet":
      return "Tablet";
    default:
      return "Unknown";
  }
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

interface AnalyticsData {
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

const viewsChartConfig = {
  views: {
    label: "Views",
    color: "var(--color-muted-foreground)",
  },
};

export function AnalyticsDashboard({ data }: { data: AnalyticsData }) {
  const [selectedProductId, setSelectedProductId] = useQueryState(
    "product",
    parseAsString.withDefault("all").withOptions({
      clearOnDefault: false,
    })
  );

  const selectedProduct = useMemo(() => {
    if (selectedProductId === "all") return null;
    return (
      data.productAnalytics.find((p) => p.id === selectedProductId) || null
    );
  }, [data.productAnalytics, selectedProductId]);

  const chartData = useMemo(() => {
    const source = selectedProduct ? selectedProduct.chartData : data.chartData;
    const filtered = source.filter((item) => item.views > 0);
    if (filtered.length === 0) return source;
    return source.map((item) => ({
      ...item,
      date: new Date(item.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    }));
  }, [data.chartData, selectedProduct]);

  const countryData = useMemo(() => {
    return selectedProduct ? selectedProduct.countryData : data.countryData;
  }, [data.countryData, selectedProduct]);

  const stats = useMemo(() => {
    if (selectedProduct) {
      return {
        views30Days: selectedProduct.views30Days,
        views7Days: selectedProduct.views7Days,
        likes: selectedProduct.likesCount,
        comments: selectedProduct.commentsCount,
        reviews: selectedProduct.reviewsCount,
      };
    }
    return {
      views30Days: data.overview.viewsLast30Days,
      views7Days: data.overview.viewsLast7Days,
      likes: data.overview.totalLikes,
      comments: data.overview.totalComments,
      reviews: data.overview.totalReviews,
    };
  }, [data.overview, selectedProduct]);

  const formatHour = (hour: number) => {
    if (hour === 0) return "12am";
    if (hour === 12) return "12pm";
    return hour < 12 ? `${hour}am` : `${hour - 12}pm`;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-end">
        <Select value={selectedProductId} onValueChange={setSelectedProductId}>
          <SelectTrigger size="xs" className="text-xs">
            <SelectValue placeholder="Select product" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">All Products</SelectItem>
            {data.productAnalytics.map((product) => (
              <SelectItem className="text-xs" key={product.id} value={product.id}>
                <span className="flex items-center gap-2">{product.name}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Views (30d)"
          value={stats.views30Days}
          icon={<Eye className="size-4" />}
          trend={
            selectedProductId === "all"
              ? data.overview.trendPercentage
              : undefined
          }
        />
        <StatCard
          label="Likes"
          value={stats.likes}
          icon={<Heart className="size-4" />}
        />
        <StatCard
          label="Comments"
          value={stats.comments}
          icon={<MessageSquare className="size-4" />}
        />
        <StatCard
          label="Reviews"
          value={stats.reviews}
          icon={<Star className="size-4" />}
        />
      </div>

      <div className="rounded-lg border bg-card p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="size-4 text-muted-foreground" />
            <span className="text-sm font-medium">Views Over Time</span>
          </div>
          <span className="text-xs text-muted-foreground">Last 30 days</span>
        </div>
        {chartData.some((d) => d.views > 0) ? (
          <ChartContainer
            config={viewsChartConfig}
            className="h-[280px] w-full"
          >
            <AreaChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-muted"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-xs"
                interval="preserveStartEnd"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-xs"
                width={40}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    indicator="dot"
                    labelFormatter={(value) => value}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="views"
                stroke="var(--color-views)"
                fill="var(--color-views)"
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
            No views recorded yet
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="size-4 text-muted-foreground" />
              <span className="text-sm font-medium">Top Countries</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {countryData.length}{" "}
              {countryData.length === 1 ? "country" : "countries"}
            </span>
          </div>
          {countryData.length > 0 ? (
            <div className="space-y-3">
              {countryData.slice(0, 8).map((item) => {
                const { flag, name } = getCountryDisplay(item.country);
                return (
                  <div key={item.country} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <span>{flag}</span>
                        <span>{name}</span>
                      </span>
                      <span className="text-muted-foreground">
                        {item.count.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-muted-foreground/50 transition-all"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
              No geographic data available
            </div>
          )}
        </div>

        {data.deviceData.length > 0 && (
          <div className="rounded-lg border bg-card p-6">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Monitor className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium">Devices</span>
              </div>
            </div>
            <div className="space-y-4">
              {data.deviceData.map((item) => (
                <div key={item.device} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className="text-muted-foreground">
                        {getDeviceIcon(item.device)}
                      </span>
                      <span>{getDeviceLabel(item.device)}</span>
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">
                        {item.percentage.toFixed(1)}%
                      </span>
                      <span className="text-muted-foreground">
                        {item.count.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-muted-foreground/50 transition-all"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedProductId === "all" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border bg-card p-6">
            <div className="mb-6 flex items-center gap-2">
              <Clock className="size-4 text-muted-foreground" />
              <span className="text-sm font-medium">Peak Hours (UTC)</span>
            </div>
            {data.hourlyData.some((d) => d.views > 0) ? (
              <ChartContainer
                config={viewsChartConfig}
                className="h-[200px] w-full"
              >
                <BarChart data={data.hourlyData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="hour"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    className="text-xs"
                    tickFormatter={formatHour}
                    interval={3}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        labelFormatter={(value) => formatHour(value as number)}
                      />
                    }
                  />
                  <Bar
                    dataKey="views"
                    fill="var(--color-views)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
                No data available
              </div>
            )}
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="mb-6 flex items-center gap-2">
              <Clock className="size-4 text-muted-foreground" />
              <span className="text-sm font-medium">Views by Day</span>
            </div>
            {data.dayOfWeekData.some((d) => d.views > 0) ? (
              <ChartContainer
                config={viewsChartConfig}
                className="h-[200px] w-full"
              >
                <BarChart data={data.dayOfWeekData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    className="text-xs"
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="views"
                    fill="var(--color-views)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
                No data available
              </div>
            )}
          </div>
        </div>
      )}

      {selectedProductId === "all" && data.productAnalytics.length > 1 && (
        <div className="rounded-lg border bg-card p-6">
          <div className="mb-6 flex items-center gap-2">
            <span className="text-sm font-medium">Product Performance</span>
          </div>
          <div className="divide-y">
            {data.productAnalytics
              .sort((a, b) => b.views30Days - a.views30Days)
              .map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <ProductLogo
                      logoUrl={product.logoUrl}
                      productName={product.name}
                      size="sm"
                    />
                    <span className="text-sm font-medium">{product.name}</span>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Eye className="size-3.5" />
                      <span>{product.views30Days}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Heart className="size-3.5" />
                      <span>{product.likesCount}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  trend,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  trend?: number;
}) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-muted-foreground">{icon}</span>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-2xl font-medium tabular-nums">
          {value.toLocaleString()}
        </span>
        {trend !== undefined && (
          <div
            className={`flex items-center gap-0.5 text-xs ${
              trend >= 0 ? "text-green-800" : "text-red-800"
            }`}
          >
            {trend >= 0 ? (
              <TrendingUp className="size-3" />
            ) : (
              <TrendingDown className="size-3" />
            )}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
