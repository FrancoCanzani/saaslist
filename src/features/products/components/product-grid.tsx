import { Product } from "../types";

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  return <div className="grid grid-cols-1 gap-4 lg:grid-cols-2"></div>;
}
