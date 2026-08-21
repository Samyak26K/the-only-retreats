"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart";
import { type Product } from "@/lib/content/product";
import { cn } from "@/lib/utils";

type ProductHeroProps = {
  product: Product;
};

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

export function ProductHero({ product }: ProductHeroProps) {
  const imageMedia = product.media.filter((item) => item.type === "image");
  const { addItem, updateQuantity } = useCartStore();
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants.find((v) => v.isDefault)?.id ??
      product.variants[0]?.id ??
      "",
  );
  const [quantity, setQuantity] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const selectedVariant = product.variants.find(
    (v) => v.id === selectedVariantId,
  );
  const currentImage = imageMedia[imageIndex] ?? {
    src: product.hero.media.desktop,
    alt: product.hero.media.alt,
  };

  return (
    <section aria-labelledby="product-title" className="bg-background">
      <div
        aria-hidden="true"
        className="h-(--navbar-height-mobile) bg-forest md:h-(--navbar-height-tablet) lg:h-(--navbar-height-desktop)"
      />

      <Container className="py-6 md:py-10">
        <div className="grid gap-6 md:gap-8 lg:grid-cols-[minmax(0,11fr)_minmax(0,9fr)] lg:items-start lg:gap-10">
          <div className="min-w-0">
            <nav className="mb-3 flex items-center gap-1.5 text-[0.6rem] uppercase tracking-wide text-muted">
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>
              <span>/</span>
              <Link href="/products" className="hover:text-foreground">
                Collection
              </Link>
              <span>/</span>
              <span className="max-w-[120px] truncate text-foreground">
                {product.name}
              </span>
            </nav>
            <figure className="min-w-0">
              <div className="flex flex-row gap-3">
                {imageMedia.length > 0 ? (
                  <ul className="flex shrink-0 flex-col gap-2">
                    {imageMedia.map((item, index) => {
                      const isSelected = index === imageIndex;

                      return (
                        <li key={item.id}>
                          <button
                            type="button"
                            onClick={() => setImageIndex(index)}
                            aria-label={`View product image ${index + 1}`}
                            aria-pressed={isSelected}
                            className={`size-14 overflow-hidden rounded-lg border p-0.5 ${
                              isSelected ? "border-gold" : "border-border"
                            }`}
                          >
                            <Image
                              src={item.src}
                              alt=""
                              width={56}
                              height={56}
                              loading="lazy"
                              className="h-full w-full object-cover"
                            />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}

                <div className="min-w-0 flex-1 rounded-(--radius-panel) border border-border/80 bg-surface p-2 shadow-lg sm:p-3">
                  <div
                    className="relative overflow-hidden rounded-xl bg-cloud"
                    style={{ height: "520px" }}
                  >
                    <Image
                      src={currentImage.src}
                      alt={currentImage.alt}
                      fill
                      priority
                      className="object-cover object-center"
                      sizes="(min-width: 1024px) 55vw, 100vw"
                    />
                    {imageMedia.length > 1 ? (
                      <>
                        <button
                          type="button"
                          aria-label="Previous image"
                          onClick={() =>
                            setImageIndex((index) => Math.max(0, index - 1))
                          }
                          disabled={imageIndex === 0}
                          className="absolute top-1/2 left-3 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/80 transition-colors hover:bg-background disabled:opacity-30"
                        >
                          <ChevronLeft className="size-4" />
                        </button>
                        <button
                          type="button"
                          aria-label="Next image"
                          onClick={() =>
                            setImageIndex((index) =>
                              Math.min(imageMedia.length - 1, index + 1),
                            )
                          }
                          disabled={imageIndex === imageMedia.length - 1}
                          className="absolute top-1/2 right-3 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/80 transition-colors hover:bg-background disabled:opacity-30"
                        >
                          <ChevronRight className="size-4" />
                        </button>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            </figure>
          </div>

          <article className="min-w-0 lg:py-2">
            <span className="mb-2 inline-block rounded-full border border-gold/40 px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.18em] text-gold">
              {product.category}
            </span>

            <p className="mb-1 text-[0.6rem] uppercase tracking-[0.18em] text-muted">
              {product.origin}
            </p>
            <p className="text-[0.6rem] uppercase tracking-[0.15em] text-gold/80 mb-2 flex items-center gap-1.5">
              <span>▲</span>
              <span>
                {product.productPassport?.altitude ?? "High Himalayan Altitude"}
              </span>
            </p>

            <h1
              id="product-title"
              className="mb-2 font-display text-2xl leading-[1] tracking-[-0.03em] text-foreground md:text-3xl lg:text-4xl"
            >
              {product.name}
            </h1>

            <div className="mb-2 flex items-center gap-2">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className="text-xs text-gold">
                    ★
                  </span>
                ))}
              </div>
              <span className="text-[0.65rem] text-muted">(24 reviews)</span>
            </div>

            <div className="mb-3 border-l-2 border-gold/40 pl-3">
              <p lang="sa" className="font-sanskrit text-sm text-gold">
                {product.shloka.devanagari}
              </p>
              <p className="mt-0.5 text-[0.65rem] text-muted italic">
                {product.shloka.translation}
              </p>
            </div>

            <div className="relative mb-4">
              <p
                className={cn(
                  "text-sm leading-6 text-muted transition-all",
                  !expanded && "line-clamp-2",
                )}
              >
                {product.tagline}
              </p>
              {product.tagline && product.tagline.length > 100 ? (
                <button
                  type="button"
                  onClick={() => setExpanded((e) => !e)}
                  className="mt-1 text-xs text-gold hover:underline"
                >
                  {expanded ? "Read less" : "Read more"}
                </button>
              ) : null}
            </div>

            <div className="mb-4">
              {selectedVariant && (
                <>
                  <p className="font-heading text-xl font-medium text-foreground">
                    {formatPrice(selectedVariant.price, product.currency)}
                  </p>
                  {selectedVariant.compareAtPrice &&
                  selectedVariant.compareAtPrice > selectedVariant.price ? (
                    <p className="mt-0.5 text-xs text-muted line-through">
                      {formatPrice(
                        selectedVariant.compareAtPrice,
                        product.currency,
                      )}
                    </p>
                  ) : null}
                  <p className="mt-0.5 text-[0.6rem] text-muted">
                    Inclusive of all taxes
                  </p>
                </>
              )}
            </div>

            <div className="mb-3">
              <p className="mb-2 text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-muted">
                Variant
              </p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setSelectedVariantId(variant.id)}
                    disabled={!variant.inStock}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                      selectedVariantId === variant.id
                        ? "border-forest bg-forest text-background"
                        : "border-border text-foreground hover:border-gold",
                      !variant.inStock && "opacity-50",
                    )}
                  >
                    {variant.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <p className="mb-2 text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-muted">
                Quantity
              </p>
              <div className="flex w-fit items-center overflow-hidden rounded-lg border border-border">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-9 w-9 items-center justify-center text-lg text-muted transition-colors hover:bg-surface"
                >
                  −
                </button>
                <span className="flex h-9 w-9 items-center justify-center border-x border-border text-sm font-medium">
                  {quantity}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-9 w-9 items-center justify-center text-lg text-muted transition-colors hover:bg-surface"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mb-3 flex gap-2">
              <Button
                type="button"
                disabled={!selectedVariant?.inStock}
                onClick={() => {
                  if (!selectedVariant || !selectedVariant.inStock) {
                    return;
                  }

                  addItem({
                    variantId: selectedVariant.id,
                    productId: product.id,
                    productSlug: product.slug,
                    productName: product.name,
                    variantLabel: selectedVariant.label,
                    price: selectedVariant.price,
                    currency: product.currency,
                    imageSrc:
                      product.media.find((m) => m.type === "image")?.src ?? "",
                    imageAlt: product.hero.media.alt,
                  });

                  if (quantity > 1) {
                    updateQuantity(selectedVariant.id, quantity);
                  }

                  setQuantity(1);
                }}
                className="h-11 flex-1 text-xs uppercase tracking-[0.18em]"
              >
                {selectedVariant?.inStock === false
                  ? "Out of Stock"
                  : "Add to Ritual"}
              </Button>
              <button
                type="button"
                onClick={() => setWishlisted((w) => !w)}
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border transition-colors",
                  wishlisted
                    ? "border-red-300 bg-red-50 text-red-500"
                    : "border-border text-muted hover:border-gold hover:text-gold",
                )}
                aria-label="Add to wishlist"
              >
                <Heart className={cn("size-4", wishlisted && "fill-current")} />
              </button>
            </div>

            <div className="mb-3 flex gap-2">
              <input
                type="text"
                placeholder="Enter PIN code"
                maxLength={6}
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-xs placeholder:text-muted/50 focus:border-gold focus:outline-none"
              />
              <button
                type="button"
                className="rounded-lg border border-border px-3 py-2 text-xs uppercase tracking-wide text-muted transition-colors hover:border-gold"
              >
                Check
              </button>
            </div>

            <div className="grid grid-cols-5 gap-1 border-t border-border pt-3">
              {[
                "Raw",
                "Single Origin",
                "Small Batch",
                "Lab Tested",
                "Pure",
              ].map((label) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1 text-center"
                >
                  <span className="text-xs text-gold">✦</span>
                  <p className="text-[0.5rem] leading-tight uppercase tracking-wide text-muted">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </Container>
    </section>
  );
}
