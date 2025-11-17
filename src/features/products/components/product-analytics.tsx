"use client";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { parseAsString, useQueryState } from "nuqs";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { useMemo } from "react";

interface Product {
  id: string;
  name: string;
}

interface AnalyticsData {
  chartData: Array<{ date: string; views: number }>;
  countryData: Array<{ country: string; count: number }>;
  totalViews: number;
}

interface ProductAnalyticsProps {
  products: Product[];
  analyticsData: {
    all: AnalyticsData;
    byProduct: Record<string, AnalyticsData>;
  } | null;
}

const chartConfig = {
  views: {
    label: "Views",
    color: "var(--color-chart-1)",
  },
};

export function ProductAnalytics({
  products,
  analyticsData,
}: ProductAnalyticsProps) {
  const [selectedProductId, setSelectedProductId] = useQueryState(
    "product",
    parseAsString.withDefault("all").withOptions({
      clearOnDefault: false,
    })
  );

  const data = useMemo(() => {
    if (!analyticsData) return null;
    if (selectedProductId === "all") {
      return analyticsData.all;
    }
    return analyticsData.byProduct[selectedProductId] || null;
  }, [analyticsData, selectedProductId]);

  const chartData = useMemo(() => {
    if (!data?.chartData) return [];
    const filtered = data.chartData.filter((item) => item.views > 0);
    if (filtered.length === 0) return [];

    return filtered.map((item) => ({
      ...item,
      date: new Date(item.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    }));
  }, [data?.chartData]);

  if (products.length === 0 || !analyticsData) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Select value={selectedProductId} onValueChange={setSelectedProductId}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select product" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Products</SelectItem>
            {products.map((product) => (
              <SelectItem key={product.id} value={product.id}>
                {product.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!data && selectedProductId && (
        <div className="rounded-lg border bg-card p-6 text-center text-sm text-muted-foreground">
          No analytics data available
        </div>
      )}

      {data && selectedProductId && (
        <>
          <div className="rounded-lg border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-2xl font-semibold">{data.totalViews.toLocaleString()}</p>
              </div>
              <p className="text-sm text-muted-foreground">Last 30 days</p>
            </div>
            {chartData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    className="text-xs"
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        indicator="dot"
                        labelFormatter={(value) => `Date: ${value}`}
                      />
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="var(--color-views)"
                    fill="var(--color-views)"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            ) : (
              <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
                No views data available
              </div>
            )}
          </div>

          {data.countryData.length > 0 && (
            <div className="rounded-lg border bg-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-medium">Visitors by Country</h3>
                <p className="text-xs text-muted-foreground">
                  {data.countryData.length} {data.countryData.length === 1 ? "country" : "countries"}
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {(() => {
                  const totalCountryViews = data.countryData.reduce(
                    (sum, item) => sum + item.count,
                    0
                  );
                  return data.countryData.map((item) => {
                    const percentage =
                      totalCountryViews > 0
                        ? (item.count / totalCountryViews) * 100
                        : 0;
                    return (
                      <div
                        key={item.country}
                        className="rounded-lg border bg-muted/30 p-3 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{item.country}</span>
                          <span className="text-xs font-mono text-muted-foreground">
                            {item.count.toLocaleString()}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{percentage.toFixed(1)}%</span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full bg-primary transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

