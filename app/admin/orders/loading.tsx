export default function AdminOrdersLoading() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-40 animate-pulse rounded-xl bg-muted/60" />

      <div className="rounded-2xl border border-border bg-background p-4 shadow-sm">
        <div className="grid w-full gap-3 md:grid-cols-[1.5fr_0.8fr_0.8fr] lg:max-w-3xl">
          <div className="h-10 animate-pulse rounded-lg bg-muted/60" />
          <div className="h-10 animate-pulse rounded-lg bg-muted/60" />
          <div className="h-10 animate-pulse rounded-lg bg-muted/60" />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
        <div className="space-y-3">
          <div className="h-4 w-full animate-pulse rounded bg-muted/60" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-muted/60" />
          <div className="h-4 w-4/6 animate-pulse rounded bg-muted/60" />
        </div>
      </div>
    </div>
  );
}
