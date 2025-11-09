"use client";

import { Button } from "@/components/ui/button";
import { parseAsInteger, useQueryState } from "nuqs";

interface LoadMoreButtonProps {
  currentPage: number;
}

export function LoadMoreButton({ currentPage }: LoadMoreButtonProps) {
  const [, setPage] = useQueryState("page", parseAsInteger.withDefault(1).withOptions({ shallow: false }));

  const handleLoadMore = () => {
    setPage(currentPage + 1);
  };

  return (
    <div className="flex justify-center">
      <Button
        onClick={handleLoadMore}
        variant="outline"
        size="lg"
        className="min-w-[200px]"
      >
        Load More
      </Button>
    </div>
  );
}

