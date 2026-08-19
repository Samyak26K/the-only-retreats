"use client";

import { useCallback, useEffect, useState } from "react";
import { Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

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
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    Array<{
      id: string;
      name: string;
      slug: string;
      origin: string | null;
    }>
  >([]);
  const router = useRouter();
  const pathname = usePathname();
  const isHomepage = pathname === "/";
  const isScrolled = useHeaderScroll(12);
  const showScrolled = isScrolled || !isHomepage;
  const itemCount = useCartStore((state) => state.getItemCount());

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setSearchResults(data.results ?? []);
    } catch {
      setSearchResults([]);
    }
  };

  const closeDrawer = useCallback(() => setMobileOpen(false), []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-colors duration-normal",
        showScrolled
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
            className={cn(utilityButtonClasses(showScrolled), "md:hidden")}
          >
            <Menu className="size-6" />
          </button>

          {/* Desktop lockup: left-aligned, flows in normal document order. */}
          <Link
            href={navigationContent.brand.href}
            className={cn(
              "hidden origin-left items-center gap-3 leading-tight transition-transform duration-normal md:flex",
              showScrolled ? "scale-100" : "scale-110",
            )}
          >
            <Image
              src="/logo.png"
              alt="The Only Retreats"
              width={40}
              height={40}
              className="object-contain"
            />
            <div className="flex flex-col leading-tight">
              <span
                className={cn(
                  "font-heading text-sm font-semibold uppercase tracking-[0.32em] transition-colors duration-normal",
                  showScrolled ? "text-foreground" : "text-background",
                )}
              >
                {navigationContent.brand.name}
              </span>
              <span
                className={cn(
                  "font-sanskrit text-[0.65rem] tracking-[0.16em] transition-colors duration-normal",
                  showScrolled ? "text-muted" : "text-background/80",
                )}
              >
                {navigationContent.brand.tagline}
              </span>
            </div>
          </Link>
        </div>

        {/* Mobile lockup: centered independent of the hamburger/search widths. */}
        <Link
          href={navigationContent.brand.href}
          className={cn(
            "absolute top-1/2 left-1/2 flex origin-center -translate-x-1/2 -translate-y-1/2 items-center gap-2 text-center leading-tight transition-transform duration-normal md:hidden",
            showScrolled ? "scale-100" : "scale-110",
          )}
        >
          <Image
            src="/logo.png"
            alt="The Only Retreats"
            width={32}
            height={32}
            className="object-contain"
          />
          <div className="flex flex-col items-center leading-tight">
            <span
              className={cn(
                "font-heading text-sm font-semibold uppercase tracking-[0.32em] transition-colors duration-normal",
                showScrolled ? "text-foreground" : "text-background",
              )}
            >
              {navigationContent.brand.name}
            </span>
            <span
              className={cn(
                "hidden font-sanskrit text-[0.65rem] tracking-[0.16em] transition-colors duration-normal sm:block",
                showScrolled ? "text-muted" : "text-background/80",
              )}
            >
              {navigationContent.brand.tagline}
            </span>
          </div>
        </Link>

        <DesktopNavigation isScrolled={showScrolled} />

        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Search"
            onClick={() => setSearchOpen(true)}
            className={utilityButtonClasses(showScrolled)}
          >
            <Search className="size-6" />
          </button>
          <button
            type="button"
            aria-label={navigationContent.utility.account.label}
            className={cn(
              utilityButtonClasses(showScrolled),
              "hidden md:inline-flex",
            )}
          >
            <UserRound className="size-6" />
          </button>
          <Link
            href="/cart"
            aria-label="Cart"
            className={cn(
              utilityButtonClasses(showScrolled),
              "relative md:hidden",
            )}
          >
            <ShoppingBag className="size-6" />
            {mounted && itemCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-gold text-[0.6rem] font-bold text-white">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>
          <Link
            href="/cart"
            aria-label={navigationContent.utility.cart.label}
            className={cn(
              utilityButtonClasses(showScrolled),
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

      {searchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-forest/80 px-4 pt-24 backdrop-blur-sm"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <Search className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted" />
              <input
                autoFocus
                type="search"
                placeholder="Search products, valleys, origins..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full rounded-2xl border border-border bg-surface py-4 pr-12 pl-12 text-lg text-foreground placeholder:text-muted/50 focus:border-gold focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-muted transition-colors hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>
            {searchResults.length > 0 && (
              <div className="mt-2 overflow-hidden rounded-2xl border border-border/30 bg-surface">
                {searchResults.map((result) => (
                  <button
                    key={result.id}
                    type="button"
                    onClick={() => {
                      router.push(`/products/${result.slug}`);
                      setSearchOpen(false);
                      setSearchQuery("");
                      setSearchResults([]);
                    }}
                    className="flex w-full items-center justify-between border-b border-border/20 px-4 py-3 text-left transition-colors last:border-0 hover:bg-background/50"
                  >
                    <span className="font-heading text-sm text-foreground">
                      {result.name}
                    </span>
                    {result.origin && (
                      <span className="text-xs text-muted">
                        {result.origin}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
            {searchQuery.length >= 2 && searchResults.length === 0 && (
              <p className="mt-4 text-center text-sm text-muted/60">
                No products found for &quot;{searchQuery}&quot;
              </p>
            )}
            <p className="mt-4 text-center text-xs text-muted">
              Press ESC to close
            </p>
          </div>
        </div>
      )}

      <MobileDrawer open={mobileOpen} onClose={closeDrawer} />
    </header>
  );
}
