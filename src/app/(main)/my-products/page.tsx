import { Alert, AlertDescription } from "@/components/ui/alert";
import { ProductActionsDropdown } from "@/features/products/components/product-actions-dropdown";
import ProductLogo from "@/features/products/components/product-logo";
import { createClient } from "@/lib/supabase/server";
import { getLoginUrl } from "@/utils/helpers";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "My Products | SaasList",
  description:
    "Manage and track your product launches on SaasList. View analytics, edit listings, and monitor performance.",
  alternates: {
    canonical: `${baseUrl}/my-products`,
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function MyProductsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(getLoginUrl("/my-products"));
  }

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="p-4 sm:p-6  space-y-8 w-full">
      <div>
        <h1 className="text-xl font-medium">My Products</h1>
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
        <div className="divide-y">
          {products?.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between py-3"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <ProductLogo
                  logoUrl={product.logo_url}
                  productName={product.name}
                  size="sm"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate">{product.name}</h3>
                  <p className="text-xs hidden sm:block text-muted-foreground truncate">
                    {product.tagline}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <ProductActionsDropdown
                  productId={product.id}
                  productName={product.name}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
