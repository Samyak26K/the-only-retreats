import Link from "next/link";

export function AdminAccessRequired() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background">
      <p className="text-sm uppercase tracking-widest text-muted">
        Admin Access Required
      </p>
      <h1 className="font-display text-3xl text-foreground">
        The Only Retreats
      </h1>
      <p className="text-sm text-muted">
        You need admin permissions to access this area.
      </p>
      <Link
        href="/sign-in"
        className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-xs uppercase tracking-[0.2em] text-white transition-colors hover:bg-forest/90"
      >
        Sign In to Admin
      </Link>
    </div>
  );
}
