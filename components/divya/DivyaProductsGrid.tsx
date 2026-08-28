"use client";

import Link from "next/link";
import { useState } from "react";

type Product = {
  id: string;
  name: string;
  slug: string;
  status: string;
  shortDescription: string | null;
  media: Array<{ url: string; alt: string | null }>;
  variants: Array<{ sellingPrice: number }>;
};

const CATEGORIES = [
  "All",
  "Ritual & Puja",
  "Ayurvedic Skincare",
  "Panchagavya Wellness",
  "Dhoop & Aromatherapy",
];

function getCategory(name: string): string {
  const n = name.toLowerCase();
  if (
    n.includes("havan") ||
    n.includes("sambrani") ||
    n.includes("dhoop") ||
    n.includes("batti")
  ) {
    if (n.includes("sambrani") || n.includes("dhoop") || n.includes("batti")) {
      return "Dhoop & Aromatherapy";
    }
    return "Ritual & Puja";
  }
  if (n.includes("soap") || n.includes("ubtan") || n.includes("de-tan")) {
    return "Ayurvedic Skincare";
  }
  if (
    n.includes("ghee") ||
    n.includes("gau") ||
    n.includes("gomutra") ||
    n.includes("nabhi") ||
    n.includes("twacha") ||
    n.includes("divya dhara")
  ) {
    return "Panchagavya Wellness";
  }
  if (n.includes("sambrani") || n.includes("dhoop") || n.includes("batti")) {
    return "Dhoop & Aromatherapy";
  }
  return "Ritual & Puja";
}

export function DivyaProductsGrid({ products }: { products: Product[] }) {
  const [active, setActive] = useState("All");

  const filtered =
    active === "All"
      ? products
      : products.filter((p) => getCategory(p.name) === active);

  return (
    <>
      {/* Filters */}
      <div className="mb-10 flex gap-3 overflow-x-auto pb-2">
        {CATEGORIES.map((cat) => (
          <button
            type="button"
            key={cat}
            onClick={() => setActive(cat)}
            className="shrink-0 rounded-full border px-5 py-2 text-xs tracking-[0.15em] uppercase transition-all"
            style={{
              borderColor: active === cat ? "#6A2434" : "#B07428",
              backgroundColor: active === cat ? "#6A2434" : "transparent",
              color: active === cat ? "#FAF5EC" : "#8A7560",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
        {filtered.map((product) => {
          const price = product.variants[0]?.sellingPrice;
          const image = product.media[0]?.url;
          const isComingSoon = product.status === "COMING_SOON";

          return (
            <Link
              key={product.id}
              href={`/divya/products/${product.slug}`}
              className="group block"
            >
              {/* Image */}
              <div
                className="relative mb-3 aspect-square overflow-hidden rounded-2xl"
                style={{
                  backgroundColor: "#F0E8D8",
                  border: "1px solid #D4B896",
                }}
              >
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <p
                      className="font-display text-4xl opacity-20"
                      style={{ color: "#B07428" }}
                    >
                      ✦
                    </p>
                  </div>
                )}

                {/* Coming soon badge */}
                {isComingSoon ? (
                  <div className="absolute top-3 left-3">
                    <span
                      className="rounded-full px-2.5 py-1 text-[0.55rem] tracking-[0.15em] uppercase"
                      style={{
                        backgroundColor: "#6A2434",
                        color: "#FAF5EC",
                      }}
                    >
                      Coming Soon
                    </span>
                  </div>
                ) : null}

                {/* Hover overlay */}
                {!isComingSoon ? (
                  <div
                    className="absolute inset-0 flex items-end justify-center pb-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(106,36,52,0.3) 0%, transparent 60%)",
                    }}
                  >
                    <span
                      className="text-[0.6rem] tracking-[0.2em] uppercase"
                      style={{ color: "#FAF5EC" }}
                    >
                      View Product →
                    </span>
                  </div>
                ) : null}
              </div>

              {/* Info */}
              <p
                className="mb-1 text-[0.55rem] uppercase tracking-[0.15em]"
                style={{ color: "#B07428" }}
              >
                {getCategory(product.name)}
              </p>
              <h3
                className="font-display mb-1 text-base leading-tight transition-opacity group-hover:opacity-70"
                style={{ color: "#2C1810" }}
              >
                {product.name}
              </h3>
              {isComingSoon ? (
                <p className="text-xs" style={{ color: "#B07428" }}>
                  Coming Soon
                </p>
              ) : price ? (
                <p className="text-sm font-medium" style={{ color: "#6A2434" }}>
                  ₹{price.toLocaleString("en-IN")}
                </p>
              ) : null}
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-sm" style={{ color: "#8A7560" }}>
            No products in this category yet.
          </p>
        </div>
      ) : null}
    </>
  );
}
