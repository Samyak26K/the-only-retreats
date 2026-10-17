"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

type Product = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  media: Array<{ url: string; alt: string | null }>;
  variants: Array<{ sellingPrice: unknown }>;
};

const CATEGORIES = ["All", "Copper", "Brass", "Kansa"];

function getCategoryFromName(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("copper")) return "Copper";
  if (lower.includes("brass")) return "Brass";
  if (lower.includes("kansa")) return "Kansa";
  return "Other";
}

export function DhatuProductsGrid({ products }: { products: Product[] }) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const [active, setActive] = useState(() => {
    if (!categoryParam) return "All";
    const param = categoryParam.toLowerCase();
    if (param === "copper") return "Copper";
    if (param === "brass") return "Brass";
    if (param === "kansa") return "Kansa";
    return "All";
  });

  const filtered =
    active === "All"
      ? products
      : products.filter((p) => getCategoryFromName(p.name) === active);

  return (
    <>
      {/* Category filters */}
      <div className="mb-10 flex gap-3 overflow-x-auto pb-2">
        {CATEGORIES.map((cat) => (
          <button
            type="button"
            key={cat}
            onClick={() => setActive(cat)}
            className="shrink-0 rounded-full border px-5 py-2 text-xs tracking-[0.15em] uppercase transition-all"
            style={{
              borderColor: active === cat ? "#B25B32" : "#5A3A2A",
              backgroundColor: active === cat ? "#B25B32" : "transparent",
              color: active === cat ? "#F2EBE0" : "#B8A98F",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Count */}
      <p className="mb-6 text-xs" style={{ color: "#5A3A2A" }}>
        {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
      </p>

      {/* Products grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((product) => {
          const price = product.variants[0]?.sellingPrice;
          const image = product.media[0]?.url;

          return (
            <Link
              key={product.id}
              href={`/dhatu/products/${product.slug}`}
              className="group block"
            >
              <div
                className="relative mb-4 flex aspect-square items-center justify-center overflow-hidden rounded-2xl transition-all duration-300"
                style={{
                  backgroundColor: "#241812",
                  border: "1px solid #5A3A2A",
                }}
              >
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={image}
                    alt={product.media[0]?.alt ?? product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <p
                    className="font-display text-5xl opacity-20"
                    style={{ color: "#B25B32" }}
                  >
                    ✦
                  </p>
                )}
                <div
                  className="absolute inset-0 flex items-end justify-center pb-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(26,18,16,0.6) 0%, transparent 60%)",
                  }}
                >
                  <span
                    className="text-[0.6rem] tracking-[0.2em] uppercase"
                    style={{ color: "#F2EBE0" }}
                  >
                    View Product →
                  </span>
                </div>
              </div>

              <h3
                className="font-display mb-2 text-base leading-tight transition-opacity group-hover:opacity-70"
                style={{ color: "#F2EBE0" }}
              >
                {product.name}
              </h3>
              {price ? (
                <p className="text-sm" style={{ color: "#C89B4A" }}>
                  ₹{Number(price).toLocaleString("en-IN")}
                </p>
              ) : null}
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-sm" style={{ color: "#5A3A2A" }}>
            No products in this category yet.
          </p>
        </div>
      ) : null}
    </>
  );
}
