"use client";

import { Button } from "@/components/ui/button";
import { parseAsInteger, useQueryState } from "nuqs";

export function LoadMoreButton({ currentPage }: { currentPage: number }) {
  const [, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1).withOptions({ shallow: false })
  );

  const handleLoadMore = () => {
    setPage(currentPage + 1);
  };

  return (
    <div className="flex justify-center">
      <Button
        onClick={handleLoadMore}
        variant="outline"
        size="xs"
        className="shadow-none"
      >
        Load More
      </Button>
    </div>
  );
}

