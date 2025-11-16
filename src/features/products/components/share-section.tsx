"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { copyToClipboard } from "@/utils/helpers";
import { Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ShareSectionProps {
  productId: string;
}

export default function ShareSection({ productId }: ShareSectionProps) {
  const [productUrl, setProductUrl] = useState("");

  useEffect(() => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    setProductUrl(`${siteUrl}/products/${productId}`);
  }, [productId]);

  const handleCopyUrl = async () => {
    const success = await copyToClipboard(productUrl);
    if (success) {
      toast.success("URL copied to clipboard!");
    } else {
      toast.error("Failed to copy URL");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h2 className="text-xl leading-tight font-medium">
          Share Your Product
        </h2>
        <p className="text-xs text-muted-foreground">
          Copy the link and share your product on SaasList
        </p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="sr-only">Product URL</label>
          <div className="flex gap-1">
            <Input
              readOnly
              value={productUrl}
              className="flex-1 font-mono text-sm"
            />
            <Button onClick={handleCopyUrl} size="icon" variant="outline">
              <Copy className="size-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
