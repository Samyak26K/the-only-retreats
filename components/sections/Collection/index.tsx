"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { collectionContent } from "@/lib/content/collection";

const productShlokas: Record<
  string,
  { sanskrit: string; translation: string }
> = {
  "winter-white-honey": {
    sanskrit: "मधु वाता ऋतायते",
    translation: "May the winds bring sweetness",
  },
  "yak-ghee-premium": {
    sanskrit: "गावो विश्वस्य मातरः",
    translation: "The cow is the mother of the world",
  },
  "raw-honey": {
    sanskrit: "मधु नक्तमुतोषसि",
    translation: "Sweet be the night and sweet the dawn",
  },
};

const productAltitudes: Record<string, string> = {
  "winter-white-honey": "3,050 m",
  "yak-ghee-premium": "3,650 m",
  "raw-honey": "2,800 m",
};

export function CollectionSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -400 : 400,
      behavior: "smooth",
    });
  };

  return (
    <section id="collection" className="bg-background py-12 md:py-28">
      <Container>
        {/* Header */}
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.24em] text-muted">
              FEATURED COLLECTION
            </p>
            <h2 className="font-display text-4xl leading-[0.95] tracking-[-0.03em] text-foreground md:text-5xl">
              विशिष्ट संग्रह
            </h2>
            <p className="mt-2 font-display text-lg text-muted italic">
              Nourishment crafted by nature, honoured by tradition.
            </p>
          </div>

          {/* Scroll arrows */}
          <div className="hidden gap-2 md:flex">
            <button
              type="button"
              onClick={() => scroll("left")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-gold hover:text-gold"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-gold hover:text-gold"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        {/* Horizontal scroll container */}
        <div
          ref={scrollRef}
          className="scrollbar-hide -mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-4 md:mx-0 md:px-0"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {collectionContent.map((product, index) => {
            const shloka = productShlokas[product.id];
            const altitude = productAltitudes[product.id];

            return (
              <div
                key={product.id}
                className="w-[80vw] flex-none snap-start md:w-[400px]"
              >
                <Link href={`/products/${product.id}`} className="group block">
                  {/* Product image */}
                  <div className="relative mb-6 aspect-[3/4] overflow-hidden rounded-2xl bg-surface">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(min-width: 768px) 400px, 80vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-surface/50">
                        <div className="space-y-2 p-6 text-center">
                          <p className="font-display text-2xl text-foreground/20">
                            {product.name}
                          </p>
                          <p className="text-xs uppercase tracking-widest text-muted/40">
                            Coming Soon
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Number overlay */}
                    <div className="absolute top-4 left-4">
                      <span className="font-display text-5xl leading-none text-white/20">
                        0{index + 1}
                      </span>
                    </div>

                    {/* Altitude badge */}
                    {altitude && (
                      <div className="absolute right-4 bottom-4 rounded-full bg-black/40 px-3 py-1 backdrop-blur-sm">
                        <p className="text-xs tracking-wider text-white/80">
                          ▲ {altitude}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Product info */}
                  <div className="space-y-3 px-1">
                    {/* Shloka */}
                    {shloka && (
                      <div className="border-l-2 border-gold/40 pl-3">
                        <p
                          lang="sa"
                          className="font-sanskrit text-sm leading-relaxed text-gold"
                        >
                          {shloka.sanskrit}
                        </p>
                        <p className="mt-0.5 text-xs text-muted italic">
                          {shloka.translation}
                        </p>
                      </div>
                    )}

                    <p className="text-xs uppercase tracking-[0.2em] text-muted">
                      {product.origin}
                    </p>

                    <h3 className="font-display text-2xl tracking-[-0.02em] text-foreground transition-colors group-hover:text-forest">
                      {product.name}
                    </h3>

                    <div className="flex items-center justify-between pt-1">
                      <p className="font-heading text-lg text-foreground">
                        ₹{product.price.toLocaleString("en-IN")}
                      </p>
                      <span className="text-xs tracking-[0.15em] text-muted uppercase transition-colors group-hover:text-forest">
                        Discover →
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* View all link */}
        <div className="mt-10 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 border-b border-border pb-1 text-sm tracking-[0.2em] text-muted uppercase transition-colors hover:border-foreground hover:text-foreground"
          >
            View Full Collection
          </Link>
        </div>
      </Container>
    </section>
  );
}
