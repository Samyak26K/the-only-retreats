"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, ShoppingBag, UserRound, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { navigationContent } from "@/lib/content/navigation";
import { cn } from "@/lib/utils";

type MobileDrawerProps = {
  open: boolean;
  onClose: () => void;
};

const drawerCloseButtonClasses =
  "flex size-12 items-center justify-center rounded-full text-foreground transition-colors duration-fast hover:bg-surface";

const drawerUtilityRowClasses =
  "flex min-h-11 items-center gap-3 rounded-lg px-2 -mx-2 text-left transition-colors duration-fast hover:bg-surface";

export function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  useFocusTrap(panelRef, open, onClose);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const { style } = document.body;
    const previousOverflow = style.overflow;
    style.overflow = "hidden";

    // Restore scroll if viewport resizes to desktop
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const handleResize = (e: MediaQueryListEvent) => {
      if (e.matches) {
        style.overflow = previousOverflow;
      }
    };
    mediaQuery.addEventListener("change", handleResize);

    return () => {
      style.overflow = previousOverflow;
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, [open]);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div className="md:hidden">
      <div
        className={cn(
          "fixed inset-0 z-50 bg-[rgba(43,43,43,0.5)] transition-opacity duration-slow",
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        ref={panelRef}
        id="mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={navigationContent.menu.title}
        inert={!open}
        className={cn(
          "fixed inset-y-0 left-0 z-[60] flex w-[85vw] max-w-xs flex-col overflow-y-auto rounded-r-3xl border-r border-border bg-background p-6 shadow-lg transition-transform duration-slow",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="The Only Retreats"
              width={28}
              height={28}
              className="object-contain"
            />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground">
              The Only Retreats
            </span>
          </div>
          <button
            type="button"
            aria-label={navigationContent.menu.closeLabel}
            onClick={onClose}
            className={drawerCloseButtonClasses}
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="mt-8 flex-1">
          <MobileNavigation onNavigate={onClose} />
        </div>

        <div className="mt-6 flex flex-col gap-1 border-t border-border pt-4">
          <div>
            <button
              type="button"
              onClick={() => setAccountOpen((o) => !o)}
              className={drawerUtilityRowClasses + " w-full"}
            >
              <UserRound className="size-5 text-muted" aria-hidden="true" />
              <span className="flex-1 text-left text-sm font-medium text-foreground">
                My Account
              </span>
              <ChevronDown
                className={cn(
                  "size-4 text-muted transition-transform",
                  accountOpen && "rotate-180",
                )}
              />
            </button>

            {accountOpen ? (
              <div className="mt-1 ml-9 space-y-1">
                {[
                  { label: "Orders", href: "/account#orders" },
                  { label: "Wishlist", href: "/account#wishlist" },
                  { label: "Saved Addresses", href: "/account#addresses" },
                  { label: "Rewards", href: "/account#rewards" },
                  { label: "Edit Profile", href: "/account#profile" },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={onClose}
                    className="block py-2 text-sm text-muted transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
          <Link
            href="/cart"
            onClick={onClose}
            className={drawerUtilityRowClasses}
          >
            <ShoppingBag className="size-5 text-muted" aria-hidden="true" />
            <span className="text-sm font-medium text-foreground">Cart</span>
          </Link>
        </div>
      </aside>
    </div>,
    document.body,
  );
}
