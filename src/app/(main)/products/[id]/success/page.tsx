import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import DistributionChecklist from "../../../../../features/products/components/distribution-checklist";
import ShareSection from "../../../../../features/products/components/share-section";
import { Separator } from "@/components/ui/separator";

export default async function ProductSuccessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: productId } = await params;

  const supabase = await createClient();
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .single();

  if (error || !product) {
    notFound();
  }

  return (
    <main className="p-6 space-y-12 max-w-2xl mx-auto py-12">
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
