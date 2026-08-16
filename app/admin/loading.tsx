export default function AdminLoading() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-64 animate-pulse rounded-xl bg-muted/60" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-border bg-background p-5 shadow-sm"
          >
            <div className="h-4 w-24 animate-pulse rounded bg-muted/60" />
            <div className="mt-4 h-10 w-32 animate-pulse rounded bg-muted/60" />
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
        <div className="h-6 w-40 animate-pulse rounded bg-muted/60" />
        <div className="mt-6 space-y-3">
          <div className="h-4 w-full animate-pulse rounded bg-muted/60" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-muted/60" />
          <div className="h-4 w-4/6 animate-pulse rounded bg-muted/60" />
        </div>
      </div>
    </div>
  );
}
