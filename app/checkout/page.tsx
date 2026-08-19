"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

const inputClassName =
  "w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground outline-none placeholder:text-muted/50 focus:border-gold";

const labelClassName =
  "mb-2 block text-xs font-semibold uppercase tracking-wide text-muted";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const clearCart = useCartStore((state) => state.clearCart);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);

  const subtotal = getSubtotal();
  const summaryCurrency = items[0]?.currency ?? "INR";

  useEffect(() => {
    setHasHydrated(useCartStore.persist.hasHydrated());

    return useCartStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (items.length === 0) {
      router.push("/cart");
    }
  }, [hasHydrated, items.length, router]);

  const handlePayment = async () => {
    setIsLoading(true);

    try {
      const orderRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: getSubtotal(),
          currency: items[0]?.currency ?? "INR",
          receipt: "receipt-" + Date.now(),
        }),
      });

      if (!orderRes.ok) throw new Error("Failed to create order");
      const orderData = await orderRes.json();

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      document.body.appendChild(script);

      await new Promise<void>((resolve) => {
        script.onload = () => resolve();
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "The Only Retreats",
        description: "Himalayan origin products",
        order_id: orderData.orderId,
        prefill: {
          name: fullName,
          email: email,
          contact: phone,
        },
        theme: {
          color: "#2D4A3E",
        },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              customerDetails: {
                fullName,
                email,
                phone,
                addressLine1,
                addressLine2,
                city,
                state,
                pincode,
              },
              items: items.map((item) => ({
                variantId: item.variantId,
                productId: item.productId,
                productName: item.productName,
                variantLabel: item.variantLabel,
                price: item.price,
                currency: item.currency,
                quantity: item.quantity,
              })),
              subtotal: getSubtotal(),
              currency: items[0]?.currency ?? "INR",
            }),
          });

          if (!verifyRes.ok) throw new Error("Payment verification failed");
          const verifyData = await verifyRes.json();

          clearCart();
          router.push(
            "/checkout/confirmation?orderNumber=" +
              verifyData.orderNumber +
              "&orderId=" +
              verifyData.orderId,
          );
        },
      };

      // @ts-expect-error — Razorpay is loaded via script tag
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasHydrated || items.length === 0) {
    return (
      <section className="bg-background">
        <div
          aria-hidden="true"
          className="h-(--navbar-height-mobile) md:h-(--navbar-height-tablet) lg:h-(--navbar-height-desktop)"
        />
      </section>
    );
  }

  return (
    <section className="bg-background">
      <div
        aria-hidden="true"
        className="h-(--navbar-height-mobile) md:h-(--navbar-height-tablet) lg:h-(--navbar-height-desktop)"
      />

      <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3 md:hidden">
        <p className="text-xs uppercase tracking-[0.15em] text-muted">
          Order Summary
        </p>
        <p className="font-heading text-sm text-foreground">
          {formatPrice(getSubtotal(), items[0]?.currency ?? "INR")}
        </p>
      </div>

      <Container className="py-12 md:py-20 lg:py-24 xl:py-[7.5rem]">
        <header className="mb-12 max-w-3xl md:mb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">
            Order
          </p>
          <h1 className="mt-4 font-display text-[clamp(2.5rem,8vw,5rem)] leading-[0.95] tracking-[-0.04em] text-foreground">
            Checkout
          </h1>
        </header>

        <div className="grid gap-16 lg:grid-cols-[minmax(0,11fr)_minmax(0,5fr)] lg:items-start lg:gap-20 xl:gap-24">
          <form
            className="space-y-12 pb-24 md:pb-0"
            onSubmit={(event) => event.preventDefault()}
          >
            <fieldset className="space-y-5">
              <legend className="font-heading text-xl text-foreground">
                Contact Information
              </legend>

              <div>
                <label htmlFor="fullName" className={labelClassName}>
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  autoComplete="name"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className={inputClassName}
                />
              </div>

              <div>
                <label htmlFor="email" className={labelClassName}>
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className={inputClassName}
                />
              </div>

              <div>
                <label htmlFor="phone" className={labelClassName}>
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className={inputClassName}
                />
              </div>
            </fieldset>

            <fieldset className="space-y-5">
              <legend className="font-heading text-xl text-foreground">
                Shipping Address
              </legend>

              <div>
                <label htmlFor="addressLine1" className={labelClassName}>
                  Address Line 1
                </label>
                <input
                  id="addressLine1"
                  name="addressLine1"
                  type="text"
                  required
                  autoComplete="address-line1"
                  value={addressLine1}
                  onChange={(event) => setAddressLine1(event.target.value)}
                  className={inputClassName}
                />
              </div>

              <div>
                <label htmlFor="addressLine2" className={labelClassName}>
                  Address Line 2
                </label>
                <input
                  id="addressLine2"
                  name="addressLine2"
                  type="text"
                  autoComplete="address-line2"
                  value={addressLine2}
                  onChange={(event) => setAddressLine2(event.target.value)}
                  className={inputClassName}
                />
              </div>

              <div>
                <label htmlFor="city" className={labelClassName}>
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  required
                  autoComplete="address-level2"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  className={inputClassName}
                />
              </div>

              <div>
                <label htmlFor="state" className={labelClassName}>
                  State
                </label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  required
                  autoComplete="address-level1"
                  value={state}
                  onChange={(event) => setState(event.target.value)}
                  className={inputClassName}
                />
              </div>

              <div>
                <label htmlFor="pincode" className={labelClassName}>
                  Pincode
                </label>
                <input
                  id="pincode"
                  name="pincode"
                  type="text"
                  required
                  inputMode="numeric"
                  autoComplete="postal-code"
                  maxLength={6}
                  value={pincode}
                  onChange={(event) => setPincode(event.target.value)}
                  className={inputClassName}
                />
              </div>
            </fieldset>

            <div>
              <div className="fixed right-0 bottom-0 left-0 border-t border-border bg-background p-4 md:relative md:right-auto md:bottom-auto md:left-auto md:border-0 md:bg-transparent md:p-0">
                <Button
                  type="button"
                  disabled={isLoading}
                  onClick={handlePayment}
                  className="h-12 w-full px-6 uppercase tracking-[0.18em] sm:h-14"
                >
                  {isLoading
                    ? "Processing..."
                    : `Pay ₹${getSubtotal().toLocaleString("en-IN")}`}
                </Button>
              </div>
              <p className="mt-4 text-xs leading-5 text-muted">
                Your payment is secured by Razorpay
              </p>
              <Link
                href="/cart"
                className="mt-6 inline-flex text-sm font-medium text-foreground/70 underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                ← Edit Cart
              </Link>
            </div>
          </form>

          <aside className="border border-border bg-surface p-6 md:p-8">
            <h2 className="font-heading text-xl text-foreground">
              Order Summary
            </h2>

            <ul className="mt-8 divide-y divide-border border-t border-border">
              {items.map((item) => (
                <li
                  key={item.variantId}
                  className="flex items-start justify-between gap-4 py-4"
                >
                  <div className="min-w-0">
                    <p className="font-heading text-sm leading-snug text-foreground">
                      {item.productName}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">
                      {item.variantLabel} · Qty {item.quantity}
                    </p>
                  </div>
                  <p className="shrink-0 font-heading text-sm text-foreground">
                    {formatPrice(item.price * item.quantity, item.currency)}
                  </p>
                </li>
              ))}
            </ul>

            <dl className="mt-6 space-y-4 border-t border-border pt-6">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                  Subtotal
                </dt>
                <dd className="font-heading text-base text-foreground">
                  {formatPrice(subtotal, summaryCurrency)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                  Shipping
                </dt>
                <dd className="font-body text-sm text-foreground">Free</dd>
              </div>
            </dl>

            <div className="mt-6 border-t border-border pt-6">
              <div className="flex items-baseline justify-between gap-4">
                <p className="font-heading text-lg text-foreground">Total</p>
                <p className="font-heading text-xl text-foreground">
                  {formatPrice(subtotal, summaryCurrency)}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
