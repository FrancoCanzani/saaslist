import { Alert, AlertDescription } from "@/components/ui/alert";
import { getProductsByDate } from "../api/get-products-by-date";
import ProductCard from "./product-card";

export default async function ProductList({
  date,
}: {
  date: "today" | "yesterday" | "week" | "month";
}) {
  const { products, title } = await getProductsByDate(date);

  if (!products || products.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl leading-tight font-medium">{title}</h2>
        <Alert>
          <AlertDescription className="mx-auto">
            Ups! It looks like we have nothing to show here
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl leading-tight font-medium">{title}</h2>
      <div className="space-y-4 flex flex-col">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} position={index + 1} />
        ))}
      </div>
    </div>
  );
}
