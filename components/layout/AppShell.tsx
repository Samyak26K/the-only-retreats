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

  return (
    <>
      {showHeader ? <Header /> : null}
      <main id="main-content" className="flex-1">
        {children}
      </main>
    </>
  );
}
