"use client";

import { Button } from "@/components/ui/button";
import { ProductSearchDialog } from "@/features/products/components/product-search";
import { useCurrentUser } from "@/hooks/use-current-user";
import Link from "next/link";
import { ProfileDropdown } from "./Profile-dropdown";

export function AuthSection() {
  const { data, isLoading } = useCurrentUser();

  if (isLoading) {
    return <div className="w-7 h-7 rounded bg-muted animate-pulse" />;
  }

  if (data?.user && data?.profile) {
    return (
      <>
        <Button size="xs">
          <Link href="/products/new">New Product</Link>
        </Button>
        <ProductSearchDialog />
        <ProfileDropdown profile={data.profile} />
      </>
    );
  }

  return (
    <Button asChild size="xs" variant="secondary" className="font-medium">
      <Link href="/login">Sign In</Link>
    </Button>
  );
}

