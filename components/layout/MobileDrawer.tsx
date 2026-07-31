"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ShoppingBag, UserRound, X } from "lucide-react";

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
  "flex min-h-14 items-center gap-4 rounded-lg px-2 -mx-2 text-left transition-colors duration-fast hover:bg-surface";

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
          "fixed inset-y-0 right-0 z-[60] flex w-[85vw] max-w-sm flex-col overflow-y-auto rounded-l-3xl border-l border-border bg-background p-8 shadow-lg transition-transform duration-slow",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">
            {navigationContent.menu.title}
          </span>
          <button
            type="button"
            aria-label={navigationContent.menu.closeLabel}
            onClick={onClose}
            className={drawerCloseButtonClasses}
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="mt-12 flex-1">
          <MobileNavigation onNavigate={onClose} />
        </div>

        <div className="mt-10 flex flex-col gap-1 border-t border-border pt-6">
          <button type="button" className={drawerUtilityRowClasses}>
            <UserRound className="size-6 text-muted" aria-hidden="true" />
            <span className="text-base font-medium text-foreground">
              {navigationContent.utility.account.label}
            </span>
          </button>
          <button type="button" className={drawerUtilityRowClasses}>
            <ShoppingBag className="size-6 text-muted" aria-hidden="true" />
            <span className="text-base font-medium text-foreground">
              {navigationContent.utility.cart.label}
            </span>
          </button>
        </div>
      </aside>
    </div>,
    document.body,
  );
}
