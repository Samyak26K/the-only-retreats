"use client";

import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { useCartStore } from "@/lib/cart";

function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const getSubtotal = useCartStore((state) => state.getSubtotal);

  const subtotal = getSubtotal();
  const summaryCurrency = items[0]?.currency ?? "INR";

  return (
    <div className="min-h-screen bg-background">
      <div
        aria-hidden="true"
        className="h-(--navbar-height-mobile) md:h-(--navbar-height-tablet) lg:h-(--navbar-height-desktop)"
      />

      <Container className="py-8 md:py-12">
        <header className="mb-6 border-b border-border pb-6">
          <p className="mb-1 text-[0.6rem] uppercase tracking-[0.24em] text-gold">
            Your Ritual
          </p>
          <div className="flex items-end justify-between">
            <h1 className="font-display text-3xl tracking-[-0.03em] text-foreground md:text-4xl">
              Shopping Cart
            </h1>
            <div className="flex items-center gap-4">
              <p className="text-sm text-muted">
                {items.length} {items.length === 1 ? "item" : "items"}
              </p>
              {items.length > 0 ? (
                <button
                  type="button"
                  onClick={() =>
                    items.forEach((item) => removeItem(item.variantId))
                  }
                  className="text-xs text-muted underline underline-offset-2 transition-colors hover:text-red-500"
                >
                  Clear
                </button>
              ) : null}
            </div>
          </div>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center space-y-6 py-24 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border">
              <span className="text-2xl text-muted/30">✦</span>
            </div>
            <div>
              <h2 className="mb-2 font-display text-2xl text-foreground">
                Your ritual is empty
              </h2>
              <p className="max-w-xs text-sm text-muted">
                Discover products sourced from Himalayan valleys
              </p>
              <p className="mt-4 text-[0.6rem] tracking-[0.2em] text-muted/40 uppercase">
                The Only Retreats · Not Mass Produced. Only Preserved.
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-xs uppercase tracking-[0.15em] text-foreground transition-colors hover:border-gold hover:text-gold"
            >
              Explore Products →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px] lg:items-start lg:gap-12">
            <div>
              <div className="mb-2 hidden grid-cols-[1fr_auto_auto_auto] gap-4 border-b border-border pb-3 md:grid">
                <p className="text-[0.6rem] uppercase tracking-[0.15em] text-muted">
                  Product
                </p>
                <p className="w-24 text-center text-[0.6rem] uppercase tracking-[0.15em] text-muted">
                  Quantity
                </p>
                <p className="w-20 text-right text-[0.6rem] uppercase tracking-[0.15em] text-muted">
                  Price
                </p>
                <p className="w-20 text-right text-[0.6rem] uppercase tracking-[0.15em] text-muted">
                  Total
                </p>
              </div>

              <ul className="divide-y divide-border">
                {items.map((item) => (
                  <li key={item.variantId} className="py-5">
                    <div className="grid grid-cols-[auto_1fr] items-center gap-4 md:grid-cols-[auto_1fr_auto_auto_auto]">
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-surface md:h-24 md:w-24">
                        {item.imageSrc ? (
                          <Image
                            src={item.imageSrc}
                            alt={item.imageAlt}
                            width={96}
                            height={96}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-cloud">
                            <span className="text-xs text-muted/40">
                              {item.productName.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <Link
                          href={`/products/${item.productSlug}`}
                          className="block font-heading text-sm leading-snug font-medium text-foreground transition-colors hover:text-gold"
                        >
                          {item.productName}
                        </Link>
                        <p className="mt-0.5 text-[0.6rem] uppercase tracking-[0.12em] text-muted">
                          {item.variantLabel}
                        </p>
                        <p className="mt-1 text-xs text-muted md:hidden">
                          {formatPrice(item.price, item.currency)}
                        </p>

                        <div className="mt-3 flex items-center gap-3 md:hidden">
                          <div className="flex items-center overflow-hidden rounded-lg border border-border">
                            <button
                              type="button"
                              aria-label={`Decrease quantity of ${item.productName}`}
                              onClick={() =>
                                updateQuantity(
                                  item.variantId,
                                  item.quantity - 1,
                                )
                              }
                              className="flex h-11 w-11 items-center justify-center text-sm text-muted hover:bg-surface"
                            >
                              −
                            </button>
                            <span className="flex h-11 w-11 items-center justify-center border-x border-border text-xs font-medium">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              aria-label={`Increase quantity of ${item.productName}`}
                              onClick={() =>
                                updateQuantity(
                                  item.variantId,
                                  item.quantity + 1,
                                )
                              }
                              className="flex h-11 w-11 items-center justify-center text-sm text-muted hover:bg-surface"
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.variantId)}
                            className="inline-flex min-h-11 items-center text-xs text-muted underline underline-offset-2 transition-colors hover:text-foreground"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      <div className="hidden w-24 overflow-hidden rounded-lg border border-border md:flex md:items-center">
                        <button
                          type="button"
                          aria-label={`Decrease quantity of ${item.productName}`}
                          onClick={() =>
                            updateQuantity(item.variantId, item.quantity - 1)
                          }
                          className="flex h-8 w-8 items-center justify-center text-muted hover:bg-surface"
                        >
                          −
                        </button>
                        <span className="flex h-8 w-8 items-center justify-center border-x border-border text-xs font-medium">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label={`Increase quantity of ${item.productName}`}
                          onClick={() =>
                            updateQuantity(item.variantId, item.quantity + 1)
                          }
                          className="flex h-8 w-8 items-center justify-center text-muted hover:bg-surface"
                        >
                          +
                        </button>
                      </div>

                      <p className="hidden w-20 text-right text-xs text-muted md:block">
                        {formatPrice(item.price, item.currency)}
                      </p>

                      <div className="hidden w-20 flex-col items-end gap-1 md:flex">
                        <p className="text-sm font-medium text-foreground">
                          {formatPrice(
                            item.price * item.quantity,
                            item.currency,
                          )}
                        </p>
                        <button
                          type="button"
                          onClick={() => removeItem(item.variantId)}
                          className="text-[0.6rem] text-muted underline underline-offset-2 transition-colors hover:text-foreground"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-muted transition-colors hover:text-foreground"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>

            <div className="sticky top-24">
              <div className="space-y-4 rounded-2xl border border-border bg-surface p-6">
                <div className="h-0.5 w-8 bg-gold" />

                <h2 className="font-heading text-sm font-semibold uppercase tracking-[0.15em] text-foreground">
                  Order Summary
                </h2>

                <div className="flex justify-between border-b border-border/50 py-2">
                  <p className="text-xs uppercase tracking-[0.12em] text-muted">
                    Subtotal (
                    {items.reduce((sum, item) => sum + item.quantity, 0)} items)
                  </p>
                  <p className="text-xs font-medium text-foreground">
                    {formatPrice(subtotal, summaryCurrency)}
                  </p>
                </div>

                <div className="flex justify-between border-b border-border/50 py-2">
                  <p className="text-xs uppercase tracking-[0.12em] text-muted">
                    Shipping
                  </p>
                  <p className="text-xs font-medium text-gold">
                    Calculated at checkout
                  </p>
                </div>

                <div className="flex justify-between pt-2">
                  <p className="font-heading text-sm font-semibold text-foreground">
                    Estimated Total
                  </p>
                  <p className="font-heading text-base font-semibold text-foreground">
                    {formatPrice(subtotal, summaryCurrency)}
                  </p>
                </div>

                <Link
                  href="/checkout"
                  className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-lg bg-forest text-xs font-medium tracking-[0.15em] text-white uppercase transition-colors hover:bg-forest/90"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  href="/products"
                  className="block text-center text-xs text-muted underline-offset-2 transition-colors hover:text-foreground hover:underline"
                >
                  ← Continue Shopping
                </Link>

                <div className="space-y-2 border-t border-border pt-3">
                  {[
                    "Secured by Razorpay",
                    "Easy returns within 48hrs",
                    "Direct from Himalayan source",
                  ].map((trust) => (
                    <div key={trust} className="flex items-center gap-2">
                      <span className="text-[0.5rem] text-gold">✦</span>
                      <p className="text-[0.6rem] uppercase tracking-wide text-muted">
                        {trust}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-3">
                  <p className="mb-2 text-[0.6rem] uppercase tracking-[0.15em] text-muted">
                    Promo Code
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter code"
                      className="flex-1 rounded-lg border border-border bg-background px-3 py-3 text-base placeholder:text-muted/40 focus:border-gold focus:outline-none"
                    />
                    <button
                      type="button"
                      className="rounded-lg border border-border px-3 py-2 text-xs uppercase tracking-wide text-muted transition-colors hover:border-gold hover:text-gold"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
