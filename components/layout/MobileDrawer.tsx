"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ShoppingBag, UserRound, X } from "lucide-react";
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

  useFocusTrap(panelRef, open, onClose);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const { style } = document.body;
    const previousOverflow = style.overflow;
    style.overflow = "hidden";

    return () => {
      style.overflow = previousOverflow;
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
          <Link
            href="/account"
            onClick={onClose}
            className={drawerUtilityRowClasses}
          >
            <UserRound className="size-5 text-muted" aria-hidden="true" />
            <span className="text-sm font-medium text-foreground">
              My Account
            </span>
          </Link>
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
