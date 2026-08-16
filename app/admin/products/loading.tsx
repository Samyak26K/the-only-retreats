export default function AdminProductsLoading() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-40 animate-pulse rounded-xl bg-muted/60" />

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
