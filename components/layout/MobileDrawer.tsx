import { useEffect } from "react";
import { X } from "lucide-react";

import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { cn } from "@/lib/utils";

type MobileDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    // Prevent body scroll when drawer is open
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  return (
    <div className="md:hidden">
      <div
        className={cn(
          "fixed inset-0 z-40 bg-[color:rgba(38,37,33,0.5)] transition-opacity duration-200",
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        id="mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[85vw] max-w-[20rem] flex-col border-r border-border bg-background p-5 shadow-lg transition-transform duration-200 overflow-y-auto",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">
            Menu
          </span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="rounded-full p-2 text-foreground transition-colors hover:bg-surface"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="mt-8 flex-1">
          <MobileNavigation onNavigate={onClose} />
        </div>
      </aside>
    </div>
  );
}
