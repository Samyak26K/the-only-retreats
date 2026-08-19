"use client";

import { useCallback, useEffect, useState } from "react";
import { Menu, Search, ShoppingBag, UserRound } from "lucide-react";
import Link from "next/link";

import { DesktopNavigation } from "@/components/layout/DesktopNavigation";
import { MobileDrawer } from "@/components/layout/MobileDrawer";
import { Container } from "@/components/ui/Container";
import { useHeaderScroll } from "@/hooks/useHeaderScroll";
import { useCartStore } from "@/lib/cart";
import { navigationContent } from "@/lib/content/navigation";
import { cn } from "@/lib/utils";

const utilityButtonClasses = (isScrolled: boolean) =>
  cn(
    "flex size-12 items-center justify-center rounded-full transition-colors duration-fast",
    isScrolled
      ? "text-foreground hover:bg-surface"
      : "text-background hover:bg-background/10",
  );

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isScrolled = useHeaderScroll(12);
  const itemCount = useCartStore((state) => state.getItemCount());

  useEffect(() => setMounted(true), []);

  const closeDrawer = useCallback(() => setMobileOpen(false), []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-colors duration-normal",
        isScrolled
          ? "bg-surface/95 shadow-md backdrop-blur-sm supports-backdrop-filter:bg-surface/85"
          : "bg-transparent",
      )}
    >
      <Container className="relative flex h-(--navbar-height-mobile) items-center justify-between gap-4 md:h-(--navbar-height-tablet) lg:h-(--navbar-height-desktop)">
        <div className="flex items-center">
          <button
            type="button"
            aria-label={navigationContent.menu.openLabel}
            aria-haspopup="dialog"
            aria-expanded={mobileOpen}
            aria-controls="mobile-drawer"
            onClick={() => setMobileOpen(true)}
            className={cn(utilityButtonClasses(isScrolled), "md:hidden")}
          >
            <Menu className="size-6" />
          </button>

          {/* Desktop lockup: left-aligned, flows in normal document order. */}
          <Link
            href={navigationContent.brand.href}
            className={cn(
              "hidden origin-left flex-col leading-tight transition-transform duration-normal md:flex",
              isScrolled ? "scale-100" : "scale-110",
            )}
          >
            <span
              className={cn(
                "font-heading text-sm font-semibold uppercase tracking-[0.32em] transition-colors duration-normal",
                isScrolled ? "text-foreground" : "text-background",
              )}
            >
              {navigationContent.brand.name}
            </span>
            <span
              className={cn(
                "font-sanskrit text-[0.65rem] tracking-[0.16em] transition-colors duration-normal",
                isScrolled ? "text-muted" : "text-background/80",
              )}
            >
              {navigationContent.brand.tagline}
            </span>
          </Link>
        </div>

        {/* Mobile lockup: centered independent of the hamburger/search widths. */}
        <Link
          href={navigationContent.brand.href}
          className={cn(
            "absolute top-1/2 left-1/2 flex origin-center -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center leading-tight transition-transform duration-normal md:hidden",
            isScrolled ? "scale-100" : "scale-110",
          )}
        >
          <span
            className={cn(
              "font-heading text-sm font-semibold uppercase tracking-[0.32em] transition-colors duration-normal",
              isScrolled ? "text-foreground" : "text-background",
            )}
          >
            {navigationContent.brand.name}
          </span>
          <span
            className={cn(
              "hidden font-sanskrit text-[0.65rem] tracking-[0.16em] transition-colors duration-normal sm:block",
              isScrolled ? "text-muted" : "text-background/80",
            )}
          >
            {navigationContent.brand.tagline}
          </span>
        </Link>

        <DesktopNavigation isScrolled={isScrolled} />

        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label={navigationContent.utility.search.label}
            className={utilityButtonClasses(isScrolled)}
          >
            <Search className="size-6" />
          </button>
          <button
            type="button"
            aria-label={navigationContent.utility.account.label}
            className={cn(
              utilityButtonClasses(isScrolled),
              "hidden md:inline-flex",
            )}
          >
            <UserRound className="size-6" />
          </button>
          <Link
            href="/cart"
            aria-label={navigationContent.utility.cart.label}
            className={cn(
              utilityButtonClasses(isScrolled),
              "relative hidden md:inline-flex",
            )}
          >
            <ShoppingBag className="size-6" />
            {mounted && itemCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-gold text-[0.6rem] font-bold text-white">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>
        </div>
      </Container>

      <MobileDrawer open={mobileOpen} onClose={closeDrawer} />
    </header>
  );
}
