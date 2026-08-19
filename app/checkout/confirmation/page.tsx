"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/button";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber") ?? "—";
  const orderId = searchParams.get("orderId") ?? "";

  return (
    <section className="bg-background">
      <div
        aria-hidden="true"
        className="h-(--navbar-height-mobile) md:h-(--navbar-height-tablet) lg:h-(--navbar-height-desktop)"
      />

      <Container className="py-24">
        <div className="mx-auto max-w-lg text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full border-2 border-gold">
            <span className="text-2xl text-gold">✓</span>
          </div>

          <h1 className="mt-8 font-display text-[clamp(2.5rem,8vw,4.5rem)] leading-[0.95] tracking-[-0.04em] text-foreground">
            Order Confirmed
          </h1>
          <p className="mt-4 font-body text-base text-muted">
            Thank you for your order.
          </p>

          <div className="mt-8 rounded-lg border border-border bg-surface p-4">
            <p className="text-xs uppercase tracking-wide text-muted">
              Order Number
            </p>
            <p className="mt-1 font-heading text-lg text-foreground">
              {orderNumber}
            </p>
            {orderId ? <p className="sr-only">Order ID {orderId}</p> : null}
          </div>

          <div className="mt-8 text-left">
            <h2 className="font-heading text-foreground">What happens next?</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>• We will confirm your order within 24 hours.</li>
              <li>• Your order will be carefully packed and shipped.</li>
              <li>• You will receive tracking details via email.</li>
            </ul>
          </div>

          <div className="mt-10 space-y-3">
            <Button
              render={<Link href="/products" />}
              className="h-12 w-full px-6 uppercase tracking-[0.18em] sm:h-14"
            >
              Continue Shopping
            </Button>
            <Button
              variant="outline"
              render={<Link href="/" />}
              className="h-12 w-full px-6 uppercase tracking-[0.18em] sm:h-14"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <ConfirmationContent />
    </Suspense>
  );
}
