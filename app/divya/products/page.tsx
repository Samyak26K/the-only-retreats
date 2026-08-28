import type { Metadata } from "next";
import Link from "next/link";

import { DivyaProductsGrid } from "@/components/divya/DivyaProductsGrid";
import { Container } from "@/components/ui/Container";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Collection — Divya | The Only Retreats",
};

export default async function DivyaProductsPage() {
  const products = await prisma.product.findMany({
    where: {
      brand: "Divya",
    },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      status: true,
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
    <div style={{ backgroundColor: "#FAF5EC" }} className="min-h-screen">
      {/* Navbar */}
      <nav
        className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between px-6 py-4"
        style={{
          backgroundColor: "#FAF5EC",
          borderBottom: "1px solid #B07428",
        }}
      >
        <Link
          href="/divya"
          className="text-[0.6rem] uppercase tracking-[0.2em]"
          style={{ color: "#B07428" }}
        >
          ← Divya
        </Link>
        <Link
          href="/divya"
          className="font-display text-lg tracking-[0.3em] uppercase"
          style={{ color: "#2C1810" }}
        >
          Divya
        </Link>
        <Link
          href="/cart"
          className="text-[0.6rem] uppercase tracking-[0.2em]"
          style={{ color: "#B07428" }}
        >
          Cart
        </Link>
      </nav>

      <div className="pt-24 pb-16">
        <Container>
          {/* Header */}
          <div
            className="mb-10 pb-8"
            style={{ borderBottom: "1px solid #B07428" }}
          >
            <p
              className="mb-3 text-[0.6rem] uppercase tracking-[0.3em]"
              style={{ color: "#B07428" }}
            >
              The Collection
            </p>
            <h1
              className="font-display text-4xl md:text-5xl"
              style={{ color: "#2C1810" }}
            >
              Sacred & Wellness
            </h1>
            <p className="mt-3 text-sm" style={{ color: "#8A7560" }}>
              {products.length} products · Rooted in Vedic tradition
            </p>
          </div>

          <DivyaProductsGrid
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
