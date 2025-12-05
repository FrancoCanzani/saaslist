"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export function MobileNav() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="md:hidden">
        <Button variant="secondary" size="xs" aria-label="Navigation menu">
          <Menu className="size-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <Link href="/browse/categories" className="cursor-pointer text-xs">
            Browse - Categories
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/browse/all" className="cursor-pointer text-xs">
            Browse - All
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/browse/tech-stacks" className="cursor-pointer text-xs">
            Browse - Tech Stack
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/newsletter" className="cursor-pointer text-xs">
            Newsletter
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/advertise" className="cursor-pointer text-xs">
            Advertise
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
