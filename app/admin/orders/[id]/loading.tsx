export default function AdminOrderDetailLoading() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-56 animate-pulse rounded-xl bg-muted/60" />

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
            <div className="h-4 w-28 animate-pulse rounded bg-muted/60" />
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="h-4 animate-pulse rounded bg-muted/60"
                />
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
            <div className="h-4 w-32 animate-pulse rounded bg-muted/60" />
            <div className="mt-4 space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-8 animate-pulse rounded bg-muted/60"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-border bg-background p-6 shadow-sm"
            >
              <div className="h-4 w-24 animate-pulse rounded bg-muted/60" />
              <div className="mt-4 space-y-3">
                <div className="h-4 animate-pulse rounded bg-muted/60" />
                <div className="h-4 animate-pulse rounded bg-muted/60" />
                <div className="h-4 animate-pulse rounded bg-muted/60" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
