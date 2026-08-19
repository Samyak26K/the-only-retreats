"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Mountain,
  X,
} from "lucide-react";

import { Container } from "@/components/ui/Container";
import { valleys } from "@/lib/content/valleys";
import type { Valley } from "@/lib/content/valleys";
import { cn } from "@/lib/utils";

const publishedValleys = valleys
  .filter((v) => v.isPublished)
  .sort((a, b) => a.order - b.order);

export function OriginsSection() {
  const [selectedValley, setSelectedValley] = useState<Valley | null>(null);
  const [showProducts, setShowProducts] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSelectValley = (valley: Valley) => {
    if (selectedValley?.slug === valley.slug) {
      setSelectedValley(null);
      setShowProducts(false);
    } else {
      setSelectedValley(valley);
      setShowProducts(false);
    }
  };

  const handleClose = () => {
    setSelectedValley(null);
    setShowProducts(false);
  };

  const scrollBy = (offset: number) => {
    scrollRef.current?.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <section
      id="origins"
      aria-label="Where it comes from"
      className="-mt-1 py-14 md:py-20"
      style={{
        backgroundColor: "#1a2a1f",
        backgroundImage: "url('/topo.svg')",
        backgroundRepeat: "repeat",
        backgroundSize: "600px 600px",
      }}
    >
      <Container>
        <div className="mb-8 md:mb-10">
          <p className="mb-3 text-xs uppercase tracking-[0.24em] text-white/50">
            OUR VALLEYS
          </p>
          <h2
            lang="sa"
            className="font-sanskrit text-3xl leading-tight text-white/90 md:text-4xl"
          >
            उपत्यका:
          </h2>
        </div>

        {selectedValley && !showProducts && (
          <div className="mb-8 animate-in fade-in duration-300">
            <div className="flex h-auto flex-col overflow-hidden rounded-xl border border-border md:h-[280px] md:flex-row">
              <div className="relative aspect-[4/3] w-full md:aspect-auto md:h-full md:w-[40%]">
                {selectedValley.coverImage ? (
                  <Image
                    src={selectedValley.coverImage}
                    alt={selectedValley.name}
                    fill
                    sizes="(min-width: 768px) 40vw, 100vw"
                    className="rounded-t-xl object-cover md:rounded-t-none md:rounded-l-xl"
                  />
                ) : (
                  <div className="flex h-full min-h-[180px] items-center justify-center rounded-t-xl bg-surface md:rounded-t-none md:rounded-l-xl">
                    <Mountain className="size-8 text-muted/40" />
                  </div>
                )}
              </div>

              <div className="flex w-full flex-col justify-between bg-surface p-6 md:w-[60%] md:rounded-r-xl">
                <div>
                  <div className="mb-3 flex items-start justify-between">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted">
                      {selectedValley.state}
                    </p>
                    <button
                      type="button"
                      onClick={handleClose}
                      className="-mt-1 -mr-1 p-1 text-muted transition-colors hover:text-foreground"
                      aria-label="Close valley details"
                    >
                      <X className="size-4" />
                    </button>
                  </div>

                  <h3 className="font-display text-2xl text-foreground">
                    {selectedValley.name}
                  </h3>

                  <p lang="sa" className="mt-2 font-sanskrit text-sm text-gold">
                    {selectedValley.shloka.sanskrit}
                  </p>

                  <p className="mt-1 text-sm text-muted italic">
                    {selectedValley.editorialTitle}
                  </p>

                  {selectedValley.altitude && (
                    <p className="mt-2 text-xs text-muted">
                      {selectedValley.altitude}
                    </p>
                  )}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={`/valleys/${selectedValley.slug}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-forest px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-forest/80"
                  >
                    View Story
                  </Link>
                  <button
                    type="button"
                    onClick={() => setShowProducts(true)}
                    className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-background"
                  >
                    View Products
                    <ArrowRight className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedValley && showProducts && (
          <div className="mb-8 animate-in fade-in duration-300">
            <div className="rounded-xl border border-border bg-surface p-6">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <button
                    type="button"
                    onClick={() => setShowProducts(false)}
                    className="text-sm text-muted transition-colors hover:text-foreground"
                  >
                    ← {selectedValley.name}
                  </button>
                  <h3 className="font-display text-2xl tracking-[-0.02em] text-foreground">
                    From {selectedValley.name}
                  </h3>
                  <p className="mt-1 text-xs text-muted">
                    {selectedValley.products.length} products from this valley
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="p-1 text-muted transition-colors hover:text-foreground"
                  aria-label="Close"
                >
                  <X className="size-4" />
                </button>
              </div>

              {selectedValley.products.length > 0 ? (
                <div>
                  {selectedValley.products.map((product) => (
                    <Link
                      key={product.slug}
                      href={`/products/${product.slug}`}
                      className="group flex items-center justify-between border-b border-border/50 py-4"
                    >
                      <div>
                        <p className="font-heading text-base text-foreground">
                          {product.name}
                        </p>
                        <p className="text-xs uppercase tracking-[0.15em] text-muted">
                          From {selectedValley.name}
                        </p>
                      </div>
                      <ArrowRight className="size-4 text-muted transition-transform group-hover:translate-x-1" />
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="py-8 text-center text-sm text-muted">
                  Products from this valley coming soon.
                </p>
              )}
            </div>
          </div>
        )}

        <div className="relative flex items-center justify-center">
          <button
            type="button"
            onClick={() => scrollBy(-300)}
            aria-label="Scroll valleys left"
            className="absolute left-0 z-10 flex size-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-background"
          >
            <ChevronLeft className="size-4" />
          </button>

          <div
            ref={scrollRef}
            className="mx-auto flex max-w-5xl gap-4 overflow-x-auto px-12 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {publishedValleys.map((valley) => {
              const isSelected = selectedValley?.slug === valley.slug;

              return (
                <button
                  key={valley.slug}
                  type="button"
                  onClick={() => handleSelectValley(valley)}
                  className={cn(
                    "group relative h-[160px] w-[260px] shrink-0 overflow-hidden rounded-xl transition-transform duration-300 hover:scale-105",
                    isSelected
                      ? "border-2 border-gold"
                      : "border-2 border-transparent",
                  )}
                >
                  {valley.coverImage ? (
                    <Image
                      src={valley.coverImage}
                      alt={valley.name}
                      fill
                      sizes="260px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center bg-surface">
                      <Mountain className="size-6 text-muted/40" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-3 text-left">
                    <p className="font-heading text-sm font-semibold tracking-wide text-white uppercase">
                      {valley.name.replace(" Valley", "")}
                    </p>
                    <p className="mt-0.5 text-xs text-white/70">
                      {valley.state}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-white/60">
                      <Mountain className="size-3" />
                      {valley.altitude}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => scrollBy(300)}
            aria-label="Scroll valleys right"
            className="absolute right-0 z-10 flex size-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-background"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </Container>
    </section>
  );
}
