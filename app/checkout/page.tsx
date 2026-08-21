"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart";
import { cn } from "@/lib/utils";

function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

const inputClassName =
  "w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-foreground outline-none placeholder:text-muted/50 focus:border-gold";

const labelClassName =
  "mb-2 block text-xs font-semibold uppercase tracking-wide text-muted";

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useUser();
  const items = useCartStore((state) => state.items);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const clearCart = useCartStore((state) => state.clearCart);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const fetchPincodeData = async (pin: string) => {
    if (pin.length !== 6) return;
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await res.json();
      if (data[0]?.Status === "Success") {
        const postOffice = data[0].PostOffice[0];
        setCity(postOffice.District);
        setState(postOffice.State);
      }
    } catch {
      // ignore
    }
  };

  const subtotal = getSubtotal();
  const summaryCurrency = items[0]?.currency ?? "INR";

  useEffect(() => {
    if (user) {
      setFullName([user.firstName, user.lastName].filter(Boolean).join(" "));
      setEmail(user.emailAddresses[0]?.emailAddress ?? "");
      setPhone(user.phoneNumbers[0]?.phoneNumber ?? "");
    }
  }, [user]);

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

    if (items.length === 0 && !paymentCompleted) {
      router.push("/cart");
    }
  }, [hasHydrated, items.length, router, paymentCompleted]);

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
          console.log("Payment response received:", response);
          try {
            console.log("Sending verify request...");
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
            console.log("Verify response status:", verifyRes.status);

            if (!verifyRes.ok) {
              const errData = await verifyRes.json();
              console.error("Verify failed:", errData);
              alert(
                "Order save failed. Payment ID: " +
                  response.razorpay_payment_id,
              );
              return;
            }

            const verifyData = await verifyRes.json();
            console.log("Verify success:", verifyData);
            setPaymentCompleted(true);
            clearCart();
            console.log(
              "Cart cleared, redirecting to:",
              "/checkout/confirmation?orderNumber=" + verifyData.orderNumber,
            );
            router.push(
              "/checkout/confirmation?orderNumber=" +
                verifyData.orderNumber +
                "&orderId=" +
                verifyData.orderId,
            );
          } catch (error) {
            console.error("Handler error:", error);
          }
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

      <Container className="py-8 md:py-12">
        <header className="mb-8 max-w-3xl md:mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">
            Order
          </p>
          <h1 className="mt-2 font-display text-3xl leading-[0.95] tracking-[-0.04em] text-foreground md:text-4xl">
            Checkout
          </h1>
        </header>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,11fr)_minmax(0,5fr)] lg:items-start lg:gap-12">
          <form
            className="space-y-8 pb-24 lg:pb-0"
            onSubmit={(event) => event.preventDefault()}
          >
            <p className="mb-6 rounded-lg border border-border bg-surface p-3 text-xs text-muted">
              ✦ No account needed — checkout as guest.
              <Link
                href="/account/sign-in"
                className="ml-1 text-gold underline underline-offset-2"
              >
                Sign in
              </Link>{" "}
              to save your details for next time.
            </p>

            <fieldset className="space-y-5">
              <legend className="mb-1 font-heading text-base text-foreground">
                Contact
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
              <legend className="mb-1 font-heading text-base text-foreground">
                Delivery Address
              </legend>

              <div>
                <label htmlFor="addressLine1" className={labelClassName}>
                  Address
                </label>
                <textarea
                  id="addressLine1"
                  name="addressLine1"
                  required
                  rows={2}
                  autoComplete="street-address"
                  value={addressLine1}
                  onChange={(event) => setAddressLine1(event.target.value)}
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
                  readOnly={city !== ""}
                  className={cn(
                    inputClassName,
                    city !== "" && "bg-surface text-muted",
                  )}
                />
              </div>

              <div>
                <label htmlFor="state" className={labelClassName}>
                  State
                </label>
                <select
                  id="state"
                  name="state"
                  required
                  autoComplete="address-level1"
                  value={state}
                  onChange={(event) => setState(event.target.value)}
                  disabled={state !== ""}
                  className={inputClassName}
                >
                  <option value="">Select State</option>
                  {[
                    "Andhra Pradesh",
                    "Arunachal Pradesh",
                    "Assam",
                    "Bihar",
                    "Chhattisgarh",
                    "Goa",
                    "Gujarat",
                    "Haryana",
                    "Himachal Pradesh",
                    "Jharkhand",
                    "Karnataka",
                    "Kerala",
                    "Madhya Pradesh",
                    "Maharashtra",
                    "Manipur",
                    "Meghalaya",
                    "Mizoram",
                    "Nagaland",
                    "Odisha",
                    "Punjab",
                    "Rajasthan",
                    "Sikkim",
                    "Tamil Nadu",
                    "Telangana",
                    "Tripura",
                    "Uttar Pradesh",
                    "Uttarakhand",
                    "West Bengal",
                    "Delhi",
                    "Jammu & Kashmir",
                    "Ladakh",
                  ].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
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
                  onChange={(event) => {
                    setPincode(event.target.value);
                    if (event.target.value.length === 6) {
                      fetchPincodeData(event.target.value);
                    }
                  }}
                  placeholder="Enter 6-digit pincode"
                  className={inputClassName}
                />
                <p className="mt-1 text-[0.6rem] text-muted">
                  City and state will be auto-filled
                </p>
              </div>
            </fieldset>

            <div>
              <div className="fixed right-0 bottom-0 left-0 z-40 border-t border-border bg-background px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:relative md:right-auto md:bottom-auto md:left-auto md:border-0 md:bg-transparent md:p-0">
                <Button
                  type="button"
                  disabled={isLoading}
                  onClick={handlePayment}
                  className="h-11 w-full text-sm uppercase tracking-[0.15em]"
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

          <aside className="sticky top-24 hidden space-y-4 rounded-2xl border border-border bg-surface px-6 pt-6 pb-24 lg:block lg:p-6">
            <div className="mb-4 h-0.5 w-8 bg-gold" />

            <h2 className="font-heading text-sm font-medium uppercase tracking-[0.15em] text-foreground">
              Order Summary
            </h2>

            <div className="space-y-3 border-b border-border pb-4">
              {items.map((item) => (
                <div
                  key={item.variantId}
                  className="flex items-start justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-foreground">
                      {item.productName}
                    </p>
                    <p className="mt-0.5 text-[0.6rem] uppercase tracking-wide text-muted">
                      {item.variantLabel} · Qty {item.quantity}
                    </p>
                  </div>
                  <p className="shrink-0 text-xs font-medium text-foreground">
                    {formatPrice(item.price * item.quantity, item.currency)}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <p className="text-xs uppercase tracking-[0.12em] text-muted">
                Subtotal
              </p>
              <p className="text-xs font-medium text-foreground">
                {formatPrice(subtotal, summaryCurrency)}
              </p>
            </div>

            <div className="flex justify-between border-b border-border pb-4">
              <p className="text-xs uppercase tracking-[0.12em] text-muted">
                Shipping
              </p>
              <p className="text-xs font-medium text-gold">Free</p>
            </div>

            <div className="flex justify-between pt-1">
              <p className="font-heading text-sm font-medium text-foreground">
                Total
              </p>
              <p className="font-heading text-base font-medium text-foreground">
                {formatPrice(subtotal, summaryCurrency)}
              </p>
            </div>

            <div className="space-y-2 border-t border-border pt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gold">✦</span>
                <p className="text-[0.6rem] uppercase tracking-wide text-muted">
                  Secured by Razorpay
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gold">✦</span>
                <p className="text-[0.6rem] uppercase tracking-wide text-muted">
                  Easy returns within 48hrs
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gold">✦</span>
                <p className="text-[0.6rem] uppercase tracking-wide text-muted">
                  Direct from Himalayan source
                </p>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
