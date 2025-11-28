import { Card } from "@/components/ui/card";
import { formatDistanceToNowStrict } from "date-fns";
import Link from "next/link";
import { getLatestProductUpdates } from "../api/get-latest-updates";
import ProductLogo from "./product-logo";

export default async function LatestProductUpdates() {
  const updates = await getLatestProductUpdates();

  return (
    <div className="space-y-6">
      <h2 className="text-xl leading-tight font-medium">
        Latest Product Updates
      </h2>
      {updates.length > 0 ? (
        <div className="space-y-4 flex flex-col">
          {updates.map((update) => (
            <Link
              key={update.id}
              href={`/products/${update.product.id}`}
              prefetch
            >
              <Card>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-start space-x-1.5">
                    <ProductLogo
                      logoUrl={update.product.logo_url}
                      productName={update.product.name}
                      size="xs"
                    />
                    <h3 className="font-medium text-sm">
                      {update.product.name}
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNowStrict(new Date(update.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm mt-1">
                    {update.title}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">
          No updates available at the moment.
        </div>
      )}
    </div>
  );
}
