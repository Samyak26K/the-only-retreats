import { SignIn } from "@clerk/nextjs";

import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-background px-6 py-16 text-foreground">
      <Container className="flex flex-col items-center justify-center gap-8">
        <div className="max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted">
            Access the admin console
          </p>
          <Heading
            title="Sign in"
            subtitle="Use your Clerk account to continue to the internal operations area."
            alignment="center"
          />
        </div>

        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-4 shadow-sm">
          <SignIn
            routing="path"
            path="/sign-in"
            forceRedirectUrl="/admin"
            signUpUrl="/sign-up"
          />
        </div>
      </Container>
    </div>
  );
}
