import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getProductById } from "@/features/products/api/get-product-by-id";
import Link from "next/link";
import { notFound } from "next/navigation";
import DistributionChecklist from "../../../../../features/products/components/distribution-checklist";
import ShareSection from "../../../../../features/products/components/share-section";

export default async function ProductSuccessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: productId } = await params;

  const product = await getProductById(productId);

  if (!product) {
    notFound();
  }

  return (
    <main className="p-6 space-y-12 max-w-2xl mx-auto py-12 w-full">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-medium tracking-tight">
          Product Submitted!
        </h1>
        <p className="text-muted-foreground text-sm">
          Your product <strong>{product.name}</strong> is now live on Saaslist
        </p>
      </div>

      <ShareSection productId={productId} />

      <Separator />

      <DistributionChecklist productId={productId} />

      <div className="flex gap-4 justify-center">
        <Button asChild variant="outline" size={"xs"}>
          <Link href={`/products/${productId}`}>View Product</Link>
        </Button>
        <Button asChild size={"xs"}>
          <Link href="/products/new">Submit Another</Link>
        </Button>
      </div>
    </main>
  );
}
