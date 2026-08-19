import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

import { Container } from "@/components/ui/Container";

export default function CustomerSignInPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-(--navbar-height-mobile) md:h-(--navbar-height-tablet) lg:h-(--navbar-height-desktop)" />

      <Container className="py-12 md:py-20">
        <div className="mx-auto max-w-md">
          <div className="mb-8">
            <p className="mb-2 text-[0.6rem] uppercase tracking-[0.24em] text-gold">
              Your Account
            </p>
            <h1 className="font-display text-3xl text-foreground">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-muted">
              Sign in to view your orders and saved details.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-4">
            <SignIn
              routing="path"
              path="/account/sign-in"
              forceRedirectUrl="/account"
              signUpUrl="/account/sign-up"
            />
          </div>

          <p className="mt-6 text-center text-xs text-muted">
            Continue without account?{" "}
            <Link
              href="/products"
              className="text-gold underline underline-offset-2"
            >
              Browse products
            </Link>
          </p>
        </div>
      </Container>
    </div>
  );
}
