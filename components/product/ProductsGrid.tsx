"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";

type Product = {
  id: string;
  name: string;
  slug: string;
  status: string;
  primaryOrigin: { name: string } | null;
  media: Array<{ url: string; alt: string | null }>;
  variants: Array<{ sellingPrice: unknown }>;
};

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Honey", value: "honey" },
  { label: "Ghee", value: "ghee" },
  { label: "Seasonal", value: "SEASONAL" },
];

function atmosphericImage(productName: string) {
  const name = productName.toLowerCase();
  if (name.includes("badri") || name.includes("cow ghee")) {
    return "/images/valleys/kullu.webp";
  }
  if (name.includes("yak")) {
    return "/images/valleys/zanskar.webp";
  }
  if (name.includes("honey")) {
    return "/images/valleys/lahaul.webp";
  }
  if (name.includes("seabuckthorn")) {
    return "/images/valleys/nubra.webp";
  }
  if (name.includes("shilajit")) {
    return "/images/valleys/changthang.webp";
  }
  return "/images/valleys/kullu.webp";
}

function toNumber(value: unknown) {
  return typeof value === "number" ? value : Number(value);
}

export function ProductsGrid({ products }: { products: Product[] }) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        (product.primaryOrigin?.name ?? "")
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesFilter =
        activeFilter === "all" ||
        product.name.toLowerCase().includes(activeFilter.toLowerCase()) ||
        product.status === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [products, search, activeFilter]);

  const [featured, ...rest] = filtered;

  return (
    <div className="pt-4 pb-12 md:pt-6 md:pb-16">
      <div className="mb-8 flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setActiveFilter(filter.value)}
              className={`rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.15em] transition-colors ${
                activeFilter === filter.value
                  ? "border-gold bg-gold/10 text-gold"
                  : "border-border text-muted hover:border-gold/50 hover:text-foreground"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted" />
          <input
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-48 rounded-full border border-border bg-background py-1.5 pr-4 pl-8 text-xs text-foreground placeholder:text-muted/50 focus:border-gold focus:outline-none"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-sm text-muted">
            No products found for &quot;{search}&quot;
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setActiveFilter("all");
            }}
            className="mt-4 text-xs text-gold underline underline-offset-2"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          {featured ? (
            <Link
              href={`/products/${featured.slug}`}
              className="group mb-6 flex flex-col overflow-hidden rounded-2xl bg-surface lg:grid lg:grid-cols-[55%_45%]"
            >
              <div className="relative aspect-[4/3] overflow-hidden lg:aspect-auto lg:h-full">
                <ProductImage
                  product={featured}
                  sizes="(min-width: 1024px) 55vw, 100vw"
                />
              </div>
              <div className="flex flex-col justify-center p-6 md:p-8">
                <ProductCopy product={featured} featured />
              </div>
            </Link>
          ) : null}

          {rest.length > 0 ? (
            <>
              <div className="my-6 border-t border-border" />
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
                {rest.map((product) => (
                  <li key={product.id}>
                    <Link
                      href={`/products/${product.slug}`}
                      className="group block"
                    >
                      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface">
                        <ProductImage
                          product={product}
                          sizes="(min-width: 1024px) 33vw, 50vw"
                        />
                      </div>
                      <div className="mt-4">
                        <ProductCopy product={product} />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </>
      )}
    </div>
  );
}

function ProductImage({ product, sizes }: { product: Product; sizes: string }) {
  const heroImage = product.media[0]?.url?.trim() ?? "";
  const src = heroImage || atmosphericImage(product.name);

  return (
    <>
      <Image
        src={src}
        alt={product.media[0]?.alt || product.name}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes={sizes}
      />
      {!heroImage ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-background/10" />
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <p className="text-center font-display text-lg leading-tight text-white/85">
              {product.name}
            </p>
          </div>
        </>
      ) : null}
    </>
  );
}

function ProductCopy({
  product,
  featured = false,
}: {
  product: Product;
  featured?: boolean;
}) {
  const prices = product.variants
    .map((variant) => toNumber(variant.sellingPrice))
    .filter((price) => Number.isFinite(price));
  const startingPrice = prices.length === 0 ? undefined : Math.min(...prices);
  const priceLabel =
    startingPrice === undefined
      ? null
      : product.variants.length > 1
        ? `From ₹${startingPrice.toLocaleString("en-IN")}`
        : `₹${startingPrice.toLocaleString("en-IN")}`;

  return (
    <>
      <p className="text-[0.65rem] uppercase tracking-wide text-muted">
        {product.primaryOrigin?.name ?? ""}
      </p>
      <h2
        className={`font-display tracking-tight text-foreground ${
          featured ? "mt-2 text-2xl md:text-3xl" : "mt-1.5 text-lg md:text-xl"
        }`}
      >
        {product.name}
      </h2>
      {priceLabel ? (
        <p
          className={`mt-2 font-heading text-gold ${
            featured ? "text-base" : "text-sm"
          }`}
        >
          {priceLabel}
        </p>
      ) : null}
      <p className="mt-3 text-[0.65rem] uppercase tracking-wide text-muted opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        Discover →
      </p>
    </>
  );
}
