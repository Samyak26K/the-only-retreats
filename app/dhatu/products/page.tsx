import type { Metadata } from "next";
import Link from "next/link";

import { DhatuProductsGrid } from "@/components/dhatu/DhatuProductsGrid";
import { Container } from "@/components/ui/Container";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Collection — Tridhatu Kosh | The Only Retreats",
  description:
    "Handcrafted copper and brass products from Indian artisan traditions.",
};

export default async function DhatuProductsPage() {
  const products = await prisma.product.findMany({
    where: {
      brand: "Dhatu",
      status: { in: ["ACTIVE", "SEASONAL"] },
    },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      shortDescription: true,
      media: {
        orderBy: { sortOrder: "asc" },
        take: 1,
        select: { url: true, alt: true },
      },
      variants: {
        where: { status: "ACTIVE" },
        select: { sellingPrice: true },
        take: 1,
      },
    },
  });

  return (
    <div style={{ backgroundColor: "#1A1210" }} className="min-h-screen">
      {/* Navbar */}
      <nav
        className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between px-6 py-4"
        style={{
          backgroundColor: "#1A1210",
          borderBottom: "1px solid #5A3A2A",
        }}
      >
        <Link
          href="/dhatu"
          className="text-[0.6rem] uppercase tracking-[0.2em]"
          style={{ color: "#B8A98F" }}
        >
          ← Tridhatu Kosh
        </Link>
        <Link
          href="/dhatu"
          className="absolute left-1/2 -translate-x-1/2 text-center pointer-events-auto"
        >
          <p
            className="font-sanskrit text-base tracking-wide leading-tight"
            style={{ color: "#F2EBE0" }}
          >
            मूल • धातु
          </p>
          <p
            className="hidden sm:block text-[0.45rem] uppercase tracking-[0.25em]"
            style={{ color: "#B8A98F" }}
          >
            ROOTS AND ORE
          </p>
        </Link>
        <Link
          href="/cart"
          className="text-[0.6rem] uppercase tracking-[0.2em]"
          style={{ color: "#B8A98F" }}
        >
          Cart
        </Link>
      </nav>

      <div className="pt-24 pb-16">
        <Container>
          {/* Header */}
          <div
            className="mb-10 pb-8"
            style={{ borderBottom: "1px solid #5A3A2A" }}
          >
            <p
              className="mb-3 text-[0.6rem] uppercase tracking-[0.3em]"
              style={{ color: "#B25B32" }}
            >
              The Collection
            </p>
            <h1
              className="font-display text-4xl md:text-5xl"
              style={{ color: "#F2EBE0" }}
            >
              Handcrafted Heritage
            </h1>
            <p className="mt-3 max-w-md text-sm" style={{ color: "#B8A98F" }}>
              {products.length} pieces. Every one made by hand.
            </p>
          </div>

          <DhatuProductsGrid
            products={products.map((p) => ({
              ...p,
              variants: p.variants.map((v) => ({
                sellingPrice: Number(v.sellingPrice),
              })),
            }))}
          />
        </Container>
      </div>
    </div>
  );
}
