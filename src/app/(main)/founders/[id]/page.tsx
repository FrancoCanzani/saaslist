import ProductLogo from "@/features/products/components/product-logo";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "date-fns";
import { Globe } from "lucide-react";
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
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 w-full">
      <div>
        <div className="flex items-center justify-between space-x-2">
          <h1 className="text-xl leading-none font-medium">{profile.name || "User"}</h1>
          <div>
          {(profile.twitter || profile.website) && (
                  <div className="flex gap-1.5 shrink-0">
                    {profile.twitter && (
                      <a
                        href={profile.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="size-6 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                        title="Twitter"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </a>
                    )}
                    {profile.website && (
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="size-6 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                        title="Website"
                      >
                        <Globe className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                )}
          </div>
        </div>
        <span className="text-muted-foreground leading-none text-xs">{`In SaasList since ${formatDate(new Date(profile.created_at), "yyyy-MM-dd")}`}</span>
      </div>

      <div>
        <h2 className="font-medium mb-4">Products ({products?.length || 0})</h2>
        {products && products.length > 0 ? (
          <div className="space-y-3 divide-y">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="flex items-center gap-3 p-2 rounded-xl border hover:bg-muted/50 transition-colors"
              >
                <ProductLogo
                  logoUrl={product.logo_url}
                  productName={product.name}
                  size="md"
                />
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
