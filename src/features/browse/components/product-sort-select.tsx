"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type SortOption =
  | "featured"
  | "likes"
  | "newest"
  | "oldest"
  | "name-asc"
  | "name-desc";

interface ProductSortSelectProps {
  value: SortOption;
  onValueChange: (value: SortOption) => void;
}

export function ProductSortSelect({ value, onValueChange }: ProductSortSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="featured">Featured</SelectItem>
        <SelectItem value="name-asc">Name (A-Z)</SelectItem>
        <SelectItem value="name-desc">Name (Z-A)</SelectItem>
        <SelectItem value="newest">Newest</SelectItem>
        <SelectItem value="oldest">Oldest</SelectItem>
        <SelectItem value="likes">Most Liked</SelectItem>
      </SelectContent>
    </Select>
  );
}

