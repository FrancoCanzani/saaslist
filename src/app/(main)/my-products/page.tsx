import { Alert, AlertDescription } from "@/components/ui/alert";
import ProductLogo from "@/features/products/components/product-logo";
import { createClient } from "@/utils/supabase/server";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
    <div className="p-6 sm:p-8 space-y-8">
      <div>
        <h1 className="text-xl font-mono font-medium">My Products</h1>
        <h2 className="dark:text-muted-foreground text-gray-600 text-sm">
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
        <div className="border rounded overflow-hidden">
          <div className="divide-y">
            {products?.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"

              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="size-10 flex items-center justify-center shrink-0">
                    <ProductLogo
                      logoUrl={product.logo_url}
                      productName={product.name}
                      size={28}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate">{product.name}</h3>
                    <p className="text-sm dark:text-muted-foreground text-gray-600 truncate">
                      {product.tagline}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6 shrink-0 text-sm dark:text-muted-foreground text-gray-600">
                  <div className="hidden sm:flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                    <span>{product.upvotes_count}</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                      />
                    </svg>
                    <span>{product.comments_count}</span>
                  </div>
                  <span className="text-xs">
                    {formatDistanceToNow(new Date(product.created_at), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


