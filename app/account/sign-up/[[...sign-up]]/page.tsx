import { SignUp } from "@clerk/nextjs";

import { Container } from "@/components/ui/Container";

export default function CustomerSignUpPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-(--navbar-height-mobile) md:h-(--navbar-height-tablet) lg:h-(--navbar-height-desktop)" />

      <Container className="py-12 md:py-20">
        <div className="mx-auto max-w-md">
          <div className="mb-8">
            <p className="mb-2 text-[0.6rem] uppercase tracking-[0.24em] text-gold">
              Join Us
            </p>
            <h1 className="font-display text-3xl text-foreground">
              Create account
            </h1>
            <p className="mt-2 text-sm text-muted">
              Save your details and track your orders.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-4">
            <SignUp
              routing="path"
              path="/account/sign-up"
              forceRedirectUrl="/account"
              signInUrl="/account/sign-in"
            />
          </div>
        </div>
      </Container>
    </div>
  );
}
