import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdvertiseSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  return (
    <main className="p-6 space-y-12 max-w-2xl mx-auto py-12">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-medium tracking-tight">
          Payment Successful!
        </h1>
        <p className="text-muted-foreground text-sm">
          Thank you for subscribing. Your products are now featured on Saaslist.
        </p>
      </div>

      <div className="space-y-4 text-center">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            It may take a few minutes for your products to appear as featured across the site.
          </p>
          <p className="text-sm text-muted-foreground">
            We now track analytics for your products, which you can view on your{" "}
            <Link href="/my-products" className="underline font-medium">
              My Products
            </Link>{" "}
            page.
          </p>
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <Button asChild variant="outline" size={"xs"}>
          <Link href="/profile">Manage Subscription</Link>
        </Button>
        <Button asChild size={"xs"}>
          <Link href="/my-products">My Products</Link>
        </Button>
      </div>
    </main>
  );
}

