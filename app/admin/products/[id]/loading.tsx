export default function AdminProductDetailLoading() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-56 animate-pulse rounded-xl bg-muted/60" />

      <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
        <div className="space-y-3">
          <div className="h-4 w-full animate-pulse rounded bg-muted/60" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-muted/60" />
          <div className="h-4 w-4/6 animate-pulse rounded bg-muted/60" />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
        <div className="h-6 w-28 animate-pulse rounded bg-muted/60" />
        <div className="mt-4 space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-10 animate-pulse rounded bg-muted/60"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
