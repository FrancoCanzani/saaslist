import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DeleteProductButton } from "@/features/products/components/delete-product-button";
import ProductLogo from "@/features/products/components/product-logo";
import { createClient } from "@/utils/supabase/server";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function MyProductsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-xl font-mono font-medium">My Products</h1>
        <h2 className="text-muted-foreground text-sm">
          Manage your product launches
        </h2>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>Failed to load products</AlertDescription>
        </Alert>
      )}

      {!error && (!products || products.length === 0) ? (
        <Alert>
          <AlertDescription>
            You haven't launched any products yet.{" "}
            <Link href="/products/new" className="underline">
              Launch your first product
            </Link>
          </AlertDescription>
        </Alert>
      ) : (
        <div>
          <div className="divide-y">
            {products?.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="size-9 flex items-center justify-center shrink-0">
                    <ProductLogo
                      logoUrl={product.logo_url}
                      productName={product.name}
                      size={28}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate">{product.name}</h3>
                    <p className="text-xs hidden sm:block text-muted-foreground truncate">
                      {product.tagline}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0 text-muted-foreground text-xs">
                  <Button asChild variant={"outline"} size={"xs"}>
                    <Link href={"#"}>Edit</Link>
                  </Button>
                  <DeleteProductButton
                    productId={product.id}
                    productName={product.name}
                  />
                  <Link
                    href={`/products/${product.id}`}
                    className="text-xs flex items-center justify-start text-muted-foreground group gap-x-1 hover:underline underline-offset-4"
                  >
                    View
                    <ArrowRight className="size-3 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
