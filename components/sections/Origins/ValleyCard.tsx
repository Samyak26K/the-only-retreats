import type { Valley } from "@/lib/content/origins";
import { cn } from "@/lib/utils";

type ValleyCardProps = {
  valley: Valley;
};

export function ValleyCard({ valley }: ValleyCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-6 sm:p-8">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold tracking-[-0.01em] text-foreground">
          {valley.name}
        </h3>
        <p className="text-[0.75rem] uppercase tracking-[0.24em] text-muted">
          {valley.region}
        </p>
      </div>

      <p className="flex-1 text-sm leading-6 text-muted/90">
        {valley.shortDescription}
      </p>

      <a
        href="#collection"
        className={cn(
          "inline-flex h-8 items-center gap-1.5 rounded-lg border border-transparent bg-primary px-2.5 text-xs font-medium text-primary-foreground transition-all hover:bg-primary/80",
          "focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        )}
      >
        Explore
      </a>
    </div>
  );
}
