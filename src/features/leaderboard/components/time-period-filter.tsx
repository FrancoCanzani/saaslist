"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { parseAsInteger, parseAsStringEnum, useQueryStates } from "nuqs";

const periods = ["today", "week", "month", "year", "all"] as const;
type Period = (typeof periods)[number];

const periodLabels: Record<Period, string> = {
  today: "Today",
  week: "This Week",
  month: "This Month",
  year: "This Year",
  all: "All Time",
};

export function TimePeriodFilter() {
  const [{ period }, setQueryStates] = useQueryStates(
    {
      period: parseAsStringEnum(["today", "week", "month", "year", "all"]).withDefault("week"),
      page: parseAsInteger.withDefault(1),
    },
    {
      shallow: false,
    }
  );

  const handlePeriodChange = (value: string) => {
    setQueryStates({
      period: value as Period,
      page: 1,
    });
  };

  return (
    <div className="flex items-center gap-2">
      <label className="sr-only">Time Period</label>
      <Select value={period} onValueChange={handlePeriodChange}>
        <SelectTrigger className="text-xs" size="xs">
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent>
          {periods.map((p) => (
            <SelectItem key={p} value={p} className="text-xs">
              {periodLabels[p]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

