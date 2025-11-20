"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FeedType } from "./feed-content";

interface FeedFilterProps {
  filter: FeedType;
  onFilterChange: (filter: FeedType) => void;
}

export function FeedFilter({ filter, onFilterChange }: FeedFilterProps) {
  return (
    <Select value={filter} onValueChange={onFilterChange}>
      <SelectTrigger size="xs" className="text-xs">
        <SelectValue placeholder="Filter" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all" className="text-xs">
          All Activity
        </SelectItem>
        <SelectItem value="reviews" className="text-xs">
          Reviews
        </SelectItem>
        <SelectItem value="comments" className="text-xs">
          Comments
        </SelectItem>
        <SelectItem value="updates" className="text-xs">
          Updates
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

