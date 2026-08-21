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
              className="group relative mb-6 flex flex-col overflow-hidden rounded-2xl border border-border transition-all duration-500 hover:border-gold/50 lg:flex-row"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface lg:aspect-auto lg:min-h-[400px] lg:w-[55%]">
                <ProductImage
                  product={featured}
                  sizes="(min-width: 1024px) 55vw, 100vw"
                />
                <div className="absolute top-4 left-4">
                  <span className="font-display text-6xl leading-none text-white/10 select-none">
                    01
                  </span>
                </div>
                {featured.status !== "ACTIVE" ? (
                  <div className="absolute top-4 right-4">
                    <span className="rounded-full border border-border bg-background/80 px-3 py-1 text-[0.6rem] tracking-wide text-muted uppercase backdrop-blur-sm">
                      {featured.status === "COMING_SOON"
                        ? "Coming Soon"
                        : featured.status === "SEASONAL"
                          ? "Seasonal"
                          : featured.status}
                    </span>
                  </div>
                ) : null}
              </div>

              <div className="flex flex-col justify-between p-6 md:p-8 lg:w-[45%]">
                <div className="space-y-3">
                  <p className="text-[0.6rem] tracking-[0.2em] text-gold uppercase">
                    Featured
                  </p>
                  <p className="text-[0.6rem] tracking-[0.15em] text-muted uppercase">
                    {featured.primaryOrigin?.name ?? ""}
                  </p>
                  <h2 className="font-display text-2xl leading-tight tracking-[-0.02em] text-foreground transition-colors group-hover:text-forest md:text-3xl">
                    {featured.name}
                  </h2>
                  <ProductPrice product={featured} className="text-base" />
                </div>
                <div className="mt-6 flex items-center gap-2 text-xs tracking-[0.15em] text-muted uppercase transition-colors group-hover:text-foreground">
                  <span>Discover</span>
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </div>
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
                      <div className="relative mb-4 aspect-[3/4] overflow-hidden rounded-2xl bg-surface">
                        <ProductImage
                          product={product}
                          sizes="(min-width: 1024px) 33vw, 50vw"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="font-display text-4xl leading-none text-white/10 select-none">
                            0{rest.indexOf(product) + 2}
                          </span>
                        </div>
                        <div className="absolute inset-0 bg-forest/0 transition-colors duration-300 group-hover:bg-forest/10" />
                        <div className="absolute right-0 bottom-4 left-0 flex justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <span className="rounded-full bg-forest/80 px-4 py-1.5 text-[0.6rem] tracking-[0.2em] text-white uppercase backdrop-blur-sm">
                            Discover →
                          </span>
                        </div>
                      </div>

                      <p className="mb-1 text-[0.55rem] tracking-[0.15em] text-muted uppercase">
                        {product.primaryOrigin?.name ?? ""}
                      </p>
                      <h3 className="mb-2 font-display text-lg leading-tight tracking-[-0.02em] text-foreground transition-colors group-hover:text-forest">
                        {product.name}
                      </h3>
                      <ProductPrice product={product} className="text-sm" />
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

function ProductPrice({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  const prices = product.variants
    .map((v) => toNumber(v.sellingPrice))
    .filter((p) => Number.isFinite(p) && p > 0);

  if (prices.length === 0) return null;

  const min = Math.min(...prices);
  const label =
    prices.length > 1
      ? `From ₹${min.toLocaleString("en-IN")}`
      : `₹${min.toLocaleString("en-IN")}`;

  return <p className={`font-heading text-gold ${className}`}>{label}</p>;
}
