"use client";

import { useClerk } from "@clerk/nextjs";

export function SignOutButton() {
  const { signOut } = useClerk();

  return (
    <button
      type="button"
      onClick={() => signOut({ redirectUrl: "/account/sign-in" })}
      className="text-xs text-muted underline underline-offset-2 transition-colors hover:text-foreground"
    >
      Sign out
    </button>
  );
}
