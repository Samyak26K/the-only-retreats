"use client";

import { useState } from "react";
import { Menu, Search, ShoppingBag, UserRound } from "lucide-react";
import Link from "next/link";

import { DesktopNavigation } from "@/components/layout/DesktopNavigation";
import { MobileDrawer } from "@/components/layout/MobileDrawer";
import { Container } from "@/components/ui/Container";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <Container className="flex h-16 items-center justify-between gap-4 md:h-20">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
            className="rounded-full p-2 text-foreground transition-colors hover:bg-surface md:hidden"
          >
            <Menu className="size-5" />
          </button>

          <Link
            href="/"
            className="text-sm font-semibold uppercase tracking-[0.32em] text-foreground"
          >
            The Only Retreats
          </Link>
        </div>

        <DesktopNavigation />

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Search"
            className="hidden rounded-full p-2 text-foreground transition-colors hover:bg-surface md:inline-flex"
          >
            <Search className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Account"
            className="hidden rounded-full p-2 text-foreground transition-colors hover:bg-surface md:inline-flex"
          >
            <UserRound className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Cart"
            className="rounded-full p-2 text-foreground transition-colors hover:bg-surface"
          >
            <ShoppingBag className="size-5" />
          </button>
        </div>
      </Container>

      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
