"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { Header } from "@/components/layout/Header";

const HIDDEN_HEADER_PREFIXES = ["/admin", "/sign-in", "/sign-up"];

function shouldShowHeader(pathname: string) {
  return !HIDDEN_HEADER_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const showHeader = shouldShowHeader(pathname ?? "/");

  // Admin/auth routes own their own document shell. Avoid wrapping them in the
  // storefront <main className="flex-1"> flex child, which can distort layout
  // coordinates and break pointer hit-testing for sidebars and actions.
  if (!showHeader) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
    </>
  );
}
