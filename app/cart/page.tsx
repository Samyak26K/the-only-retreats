"use client";

import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
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
    <section className="bg-background">
      <div
        aria-hidden="true"
        className="h-(--navbar-height-mobile) md:h-(--navbar-height-tablet) lg:h-(--navbar-height-desktop)"
      />

      <Container className="pb-12 pt-0 md:pb-20 lg:pb-24 xl:pb-[7.5rem]">
        {items.length === 0 ? (
          <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">
              Your Ritual
            </p>
            <h1 className="mb-4 font-display text-4xl text-foreground">
              Your ritual is empty
            </h1>
            <p className="mb-8 text-muted">
              Discover products from the Himalayan valleys
            </p>
            <Button
              render={<Link href="/products" />}
              className="h-12 px-6 uppercase tracking-[0.18em] sm:h-14"
            >
              Explore Products
            </Button>
          </div>
        ) : (
          <>
            <header className="pt-8 md:pt-16">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-gold">
                CART
              </p>
              <h1 className="font-display text-6xl leading-[0.95] tracking-[-0.04em] text-foreground md:text-7xl lg:text-8xl">
                Your Ritual
              </h1>
            </header>
            <div className="mb-12 border-t border-border md:mb-16" />

            <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-16 xl:gap-24">
              <ul>
                {items.map((item) => (
                  <li
                    key={item.variantId}
                    className="border-b border-border py-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-surface">
                        {item.imageSrc ? (
                          <Image
                            src={item.imageSrc}
                            alt={item.imageAlt}
                            width={80}
                            height={80}
                            className="size-full object-cover"
                          />
                        ) : (
                          <div
                            aria-hidden="true"
                            className="size-full bg-cloud"
                          />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="font-heading text-base font-medium leading-snug text-foreground">
                          {item.productName}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-[0.12em] text-muted">
                          {item.variantLabel}
                        </p>
                        <p className="mt-1 text-sm text-muted">
                          {formatPrice(item.price, item.currency)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center overflow-hidden rounded-lg border border-border">
                        <button
                          type="button"
                          aria-label={`Decrease quantity of ${item.productName}`}
                          onClick={() =>
                            updateQuantity(item.variantId, item.quantity - 1)
                          }
                          className="flex h-9 w-9 items-center justify-center text-muted hover:bg-surface"
                        >
                          −
                        </button>
                        <output
                          aria-label={`Quantity of ${item.productName}`}
                          className="flex h-9 w-9 items-center justify-center border-x border-border text-sm font-medium"
                        >
                          {item.quantity}
                        </output>
                        <button
                          type="button"
                          aria-label={`Increase quantity of ${item.productName}`}
                          onClick={() =>
                            updateQuantity(item.variantId, item.quantity + 1)
                          }
                          className="flex h-9 w-9 items-center justify-center text-muted hover:bg-surface"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <p className="font-heading text-base text-foreground">
                          {formatPrice(
                            item.price * item.quantity,
                            item.currency,
                          )}
                        </p>
                        <button
                          type="button"
                          onClick={() => removeItem(item.variantId)}
                          className="text-xs text-muted underline underline-offset-2"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <aside className="sticky top-32 rounded-2xl border border-border bg-surface p-8">
                <h2 className="mb-6 font-heading text-lg font-medium text-foreground">
                  Order Summary
                </h2>

                <div className="flex justify-between border-b border-border/50 py-3">
                  <p className="text-xs uppercase tracking-[0.15em] text-muted">
                    Subtotal
                  </p>
                  <p className="font-heading text-sm text-foreground">
                    {formatPrice(subtotal, summaryCurrency)}
                  </p>
                </div>
                <div className="flex justify-between border-b border-border/50 py-3">
                  <p className="text-xs uppercase tracking-[0.15em] text-muted">
                    Shipping
                  </p>
                  <p className="font-heading text-sm text-foreground">
                    Calculated at checkout
                  </p>
                </div>

                <div className="mt-2 flex justify-between pt-4">
                  <p className="font-heading text-base font-medium text-foreground">
                    Total
                  </p>
                  <p className="font-heading text-xl font-medium text-foreground">
                    {formatPrice(subtotal, summaryCurrency)}
                  </p>
                </div>

                <Button
                  render={<Link href="/checkout" />}
                  className="mt-8 h-12 w-full px-6 uppercase tracking-[0.18em] sm:h-14"
                >
                  Proceed to Checkout
                </Button>
                <p className="mt-4 text-center text-xs text-muted">
                  Taxes included. Shipping calculated at checkout.
                </p>
                <Link
                  href="/products"
                  className="mt-4 block text-center text-xs text-muted underline-offset-2 transition-colors hover:text-foreground hover:underline"
                >
                  ← Continue Shopping
                </Link>
              </aside>
            </div>
          </>
        )}
      </Container>
    </section>
  );
}
