import ProductCardSkeleton from "./product-card-skeleton";

export default function ProductListSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

