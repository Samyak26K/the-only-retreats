"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const navItems = [
  { label: "Orders", href: "#orders", icon: "📦" },
  { label: "Edit Profile", href: "#profile", icon: "✎" },
  { label: "Saved Addresses", href: "#addresses", icon: "◎" },
  { label: "Wishlist", href: "#wishlist", icon: "♡" },
  { label: "Rewards", href: "#rewards", icon: "✦" },
];

export function AccountNav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("Orders");

  const handleSelect = (item: (typeof navItems)[0]) => {
    setActive(item.label);
    setOpen(false);
    const el = document.querySelector(item.href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <div className="relative mb-6 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between rounded-xl border border-border bg-surface px-4 py-3 text-sm font-medium text-foreground"
        >
          <div className="flex items-center gap-2">
            <span>{navItems.find((n) => n.label === active)?.icon}</span>
            <span>{active}</span>
          </div>
          <ChevronDown
            className={`size-4 text-muted transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {open ? (
          <div className="absolute top-full right-0 left-0 z-10 mt-1 overflow-hidden rounded-xl border border-border bg-background shadow-lg">
            {navItems.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleSelect(item)}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-surface ${
                  active === item.label
                    ? "bg-gold/5 text-gold"
                    : "text-foreground"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <nav className="hidden space-y-1 lg:block">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            onClick={() => setActive(item.label)}
            className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-colors ${
              active === item.label
                ? "bg-gold/5 text-gold"
                : "text-muted hover:bg-surface hover:text-foreground"
            }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </a>
        ))}
      </nav>
    </>
  );
}
