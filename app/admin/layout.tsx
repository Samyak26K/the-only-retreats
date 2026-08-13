import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/Container";
import { requireAdmin } from "@/lib/server/auth";

export const metadata: Metadata = {
  title: "Admin",
  description: "Internal administration for The Only Retreats",
};

const navigation = [
  { href: "/admin", label: "Overview", section: "OVERVIEW" },
  { href: "/admin/products", label: "Products", section: "CATALOG" },
  { href: "/admin/origins", label: "Origins", section: "CATALOG" },
  { href: "/admin/inventory", label: "Inventory", section: "OPERATIONS" },
  { href: "/admin/orders", label: "Orders", section: "OPERATIONS" },
  { href: "/admin/customers", label: "Customers", section: "OPERATIONS" },
  { href: "/admin/content", label: "Content", section: "EDITORIAL" },
  { href: "/admin/settings", label: "Settings", section: "SYSTEM" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adminContext = await requireAdmin().catch(() => null);

  if (!adminContext) {
    return (
      <div className="min-h-screen bg-background px-6 py-16">
        <Container className="max-w-2xl rounded-2xl border border-border bg-card p-10 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted">
            Access restricted
          </p>
          <h1 className="mt-4 font-display text-3xl text-foreground">
            You need admin access to view this area.
          </h1>
          <p className="mt-4 text-sm leading-7 text-muted">
            The admin console is protected server-side and only available to
            authorized personnel.
          </p>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="w-full border-b border-border bg-background/95 px-6 py-6 lg:w-72 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between lg:block">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted">
                The Only Retreats
              </p>
              <h2 className="mt-2 font-display text-2xl text-foreground">
                Admin Console
              </h2>
            </div>
            <Link
              href="/"
              className="text-sm text-primary underline-offset-4 hover:underline lg:mt-4"
            >
              View site
            </Link>
          </div>

          <div className="mt-8 space-y-8">
            {[
              ["OVERVIEW", "Dashboard"],
              ["CATALOG", "Catalog"],
              ["OPERATIONS", "Operations"],
              ["EDITORIAL", "Editorial"],
              ["SYSTEM", "System"],
            ].map(([sectionKey, sectionLabel]) => {
              const items = navigation.filter(
                (item) => item.section === sectionKey,
              );
              return (
                <div key={sectionKey}>
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-muted">
                    {sectionLabel}
                  </p>
                  <div className="mt-3 space-y-1">
                    {items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-muted hover:text-foreground"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        <div className="flex-1">
          <header className="border-b border-border bg-background/90 px-6 py-4 backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted">
                  Internal operations
                </p>
                <h1 className="font-display text-2xl text-foreground">
                  Operations Dashboard
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-full border border-border bg-muted/30 px-3 py-2 text-sm text-foreground">
                  {adminContext.roleName}
                </div>
                <Button variant="outline" size="sm">
                  {adminContext.email ?? "Admin"}
                </Button>
              </div>
            </div>
          </header>

          <main className="px-6 py-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
