import { Alert, AlertDescription } from "@/components/ui/alert";
import { getProducts } from "../api/get-products";
import { Product } from "../types";
import ProductCard from "./product-card";

export default async function ProductGrid() {
  const { products } = await getProducts();

  if (!products || products.length === 0) {
    return (
      <div className="space-y-6">
        <Alert>
          <AlertDescription className="mx-auto">
            Ups! It looks like we have nothing to show here
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product: Product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
