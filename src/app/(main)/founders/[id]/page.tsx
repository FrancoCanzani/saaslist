import ProductLogo from "@/features/products/components/product-logo";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "date-fns";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function MakerProfilePage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (profileError || !profile) {
    notFound();
  }

  const { data: products } = await supabase
    .from("products")
    .select("id, name, tagline, logo_url")
    .eq("user_id", id)
    .order("created_at", { ascending: false });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <div className="flex items-center justify-between space-x-2">
          <h1 className="text-xl font-medium">{profile.name || "User"}</h1>
          <div>
            {(profile.twitter || profile.website) && (
              <div className="space-x-2">
                {profile.twitter && (
                  <a
                    href={profile.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:underline text-blue-600 dark:text-blue-400 transition-colors"
                  >
                    Twitter
                  </a>
                )}
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:underline text-blue-600 dark:text-blue-400 transition-colors"
                  >
                    Website
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
        <span className="text-muted-foreground text-xs">{`In SaasList since ${formatDate(new Date(profile.created_at), "yyyy-MM-dd")}`}</span>
      </div>

      <div>
        <h2 className="font-medium mb-4">Products ({products?.length || 0})</h2>
        {products && products.length > 0 ? (
          <div className="space-y-3 divide-y">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="flex items-center gap-3 p-2 rounded border hover:bg-muted/50 transition-colors"
              >
                <div className="size-10 flex items-center justify-center shrink-0">
                  <ProductLogo
                    logoUrl={product.logo_url}
                    productName={product.name}
                    size={24}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">
                    {product.name}
                  </h3>
                  {product.tagline && (
                    <p className="text-xs text-muted-foreground truncate">
                      {product.tagline}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No products yet.</p>
        )}
      </div>
    </div>
  );
}
