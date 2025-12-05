"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { parseAsInteger, parseAsStringEnum, useQueryStates } from "nuqs";
import { z } from "zod";

const sortOptionSchema = z.enum([
  "a-z",
  "z-a",
  "most-liked",
  "latest",
  "older",
]);

type SortOption = z.infer<typeof sortOptionSchema>;

const sortOptions: readonly SortOption[] = [
  "a-z",
  "z-a",
  "most-liked",
  "latest",
  "older",
];

const sortLabels: Record<SortOption, string> = {
  "a-z": "Name (A-Z)",
  "z-a": "Name (Z-A)",
  "most-liked": "Most Liked",
  latest: "Latest",
  older: "Older",
};

export default function OrderByDropdown() {
  const [{ orderBy }, setQueryStates] = useQueryStates(
    {
      orderBy: parseAsStringEnum([
        "a-z",
        "z-a",
        "most-liked",
        "latest",
        "older",
      ]).withDefault("latest"),
      page: parseAsInteger.withDefault(1),
    },
    {
      shallow: false,
    },
  );

  const handleSortChange = (value: string) => {
    const result = sortOptionSchema.safeParse(value);
    if (result.success) {
      setQueryStates({
        orderBy: result.data,
        page: 1,
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Label className="sr-only">Sort by</Label>
      <Select value={orderBy} onValueChange={handleSortChange}>
        <SelectTrigger className="text-xs" size="xs">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option} value={option} className="text-xs">
              {sortLabels[option]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
