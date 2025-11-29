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
        <Button
          size="xs"
          className="active:scale-98 border-primary bg-primary/75 text-primary-foreground hover:bg-primary/85 dark:bg-primary/90 dark:border-primary dark:hover:bg-primary border border-b-2 shadow-md shadow-zinc-950/20 ring ring-inset ring-white/15 transition-[filter,scale,background] duration-200 hover:brightness-110 dark:ring-transparent"
        >
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
