"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProduct } from "@/features/products/queries";
import { CheckCircle2, Copy, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";

export default function ProductSuccessPage() {
  const params = useParams();
  const productId = params.id as string;
  const { data: product, isLoading } = useProduct(productId);

  const badgeCode = useMemo(() => {
    if (!productId) return "";
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    const productUrl = `${siteUrl}/products/${productId}`;
    return `<a href="${productUrl}" target="_blank" rel="noopener noreferrer"><img src="${siteUrl}/api/badge/${productId}" alt="Live on Saaslist" /></a>`;
  }, [productId]);

  const handleCopyBadge = () => {
    navigator.clipboard.writeText(badgeCode);
    toast.success("Badge code copied to clipboard!");
  };

  const distributionChannels = useMemo(() => {
    if (!product) return [];
    return [
      {
        name: "Product Page",
        url: `/products/${productId}`,
        description: "Share your product page directly",
        external: false,
      },
      ...(product.twitter_url
        ? [
            {
              name: "Twitter",
              url: product.twitter_url,
              description: "Share on Twitter",
              external: true,
            },
          ]
        : []),
      ...(product.linkedin_url
        ? [
            {
              name: "LinkedIn",
              url: product.linkedin_url,
              description: "Share on LinkedIn",
              external: true,
            },
          ]
        : []),
      ...(product.product_hunt_url
        ? [
            {
              name: "Product Hunt",
              url: product.product_hunt_url,
              description: "Share on Product Hunt",
              external: true,
            },
          ]
        : []),
    ];
  }, [product, productId]);

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto">Product not found</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <CheckCircle2 className="size-12 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-medium">Product Submitted!</h1>
            <p className="text-muted-foreground mt-2">
              Your product <strong>{product.name}</strong> is now live on Saaslist
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Embed Badge</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center p-6 border rounded bg-muted/50">
              <img
                src={`/api/badge/${productId}`}
                alt="Live on Saaslist"
                className="h-8 w-auto"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Badge Code</label>
              <div className="flex gap-2">
                <textarea
                  readOnly
                  value={badgeCode}
                  className="flex-1 min-h-[80px] p-3 text-sm font-mono bg-muted rounded border"
                />
                <Button onClick={handleCopyBadge} size="icon" variant="outline">
                  <Copy className="size-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Copy and paste this code into your website to display the badge
              </p>
            </div>
          </CardContent>
        </Card>

        {distributionChannels.length > 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Distribution Channels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {distributionChannels.map((channel) => (
                  <Link
                    key={channel.name}
                    href={channel.url}
                    target={channel.external ? "_blank" : undefined}
                    rel={channel.external ? "noopener noreferrer" : undefined}
                  >
                    <div className="flex items-center justify-between p-3 border rounded hover:bg-accent transition-colors">
                      <div>
                        <div className="font-medium">{channel.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {channel.description}
                        </div>
                      </div>
                      {channel.external && (
                        <ExternalLink className="size-4 text-muted-foreground" />
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-4 justify-center">
          <Button asChild variant="outline">
            <Link href={`/products/${productId}`}>View Product</Link>
          </Button>
          <Button asChild>
            <Link href="/products/new">Submit Another</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

