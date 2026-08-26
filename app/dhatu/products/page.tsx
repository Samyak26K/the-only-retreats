import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Collection — Dhatu | The Only Retreats",
  description:
    "Handcrafted copper and brass products from Indian artisan traditions.",
};

const placeholderProducts = [
  {
    name: "Hammered Copper Water Bottle",
    slug: "hammered-copper-water-bottle",
    category: "Copper Bottles",
    price: 1299,
    description:
      "Pure copper, hand-hammered by artisans. Ayurvedic benefits of copper-stored water.",
  },
  {
    name: "Brass Puja Thali Set",
    slug: "brass-puja-thali-set",
    category: "Ritual",
    price: 2499,
    description:
      "Traditional brass thali with intricate hand-engraved patterns. Complete ritual set.",
  },
  {
    name: "Copper Serving Bowl",
    slug: "copper-serving-bowl",
    category: "Serveware",
    price: 1899,
    description:
      "Hand-beaten copper bowl. Naturally antimicrobial. Built to last generations.",
  },
];

export default function DhatuProductsPage() {
  return (
    <div style={{ backgroundColor: "#1A1210" }} className="min-h-screen">
      {/* Navbar */}
      <nav
        className="fixed top-0 right-0 left-0 z-40 flex items-center justify-between px-6 py-4"
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
          ← Dhatu
        </Link>
        <p
          className="font-display text-lg tracking-[0.3em] uppercase"
          style={{ color: "#F2EBE0" }}
        >
          Dhatu
        </p>
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
            className="mb-12 pb-8"
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
              Every piece is made by hand. Every surface tells a story.
            </p>
          </div>

          {/* Category filters */}
          <div className="mb-10 flex gap-3 overflow-x-auto pb-2">
            {[
              "All",
              "Copper Bottles",
              "Cookware",
              "Serveware",
              "Decor",
              "Ritual",
            ].map((cat) => (
              <button
                key={cat}
                className="shrink-0 rounded-full border px-4 py-2 text-xs tracking-[0.15em] uppercase transition-colors"
                style={{ borderColor: "#5A3A2A", color: "#B8A98F" }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Products grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {placeholderProducts.map((product) => (
              <Link
                key={product.slug}
                href={`/dhatu/products/${product.slug}`}
                className="group block"
              >
                {/* Image placeholder */}
                <div
                  className="relative mb-4 flex aspect-square items-center justify-center overflow-hidden rounded-2xl"
                  style={{
                    backgroundColor: "#241812",
                    border: "1px solid #5A3A2A",
                  }}
                >
                  <div className="text-center">
                    <p
                      className="font-display text-5xl"
                      style={{ color: "#5A3A2A" }}
                    >
                      ✦
                    </p>
                    <p
                      className="mt-2 text-[0.6rem] tracking-wide uppercase"
                      style={{ color: "#5A3A2A" }}
                    >
                      {product.category}
                    </p>
                  </div>
                  {/* Hover overlay */}
                  <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ backgroundColor: "rgba(178,91,50,0.1)" }}
                  >
                    <span
                      className="text-xs tracking-[0.2em] uppercase"
                      style={{ color: "#B25B32" }}
                    >
                      View Product →
                    </span>
                  </div>
                </div>

                {/* Info */}
                <p
                  className="mb-1 text-[0.55rem] uppercase tracking-[0.2em]"
                  style={{ color: "#B25B32" }}
                >
                  {product.category}
                </p>
                <h3
                  className="font-display mb-2 text-lg leading-tight transition-opacity group-hover:opacity-80"
                  style={{ color: "#F2EBE0" }}
                >
                  {product.name}
                </h3>
                <p
                  className="mb-3 text-xs leading-5"
                  style={{ color: "#B8A98F" }}
                >
                  {product.description}
                </p>
                <p
                  className="font-heading text-base"
                  style={{ color: "#C89B4A" }}
                >
                  ₹{product.price.toLocaleString("en-IN")}
                </p>
              </Link>
            ))}
          </div>
        </Container>
      </div>
    </div>
  );
}
