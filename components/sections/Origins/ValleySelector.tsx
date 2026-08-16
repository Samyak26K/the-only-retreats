import Image from "next/image";

import type { Valley } from "@/lib/content/valleys";
import { cn } from "@/lib/utils";

type ValleySelectorProps = {
  valleys: Valley[];
  selectedSlug: string;
  onSelect: (slug: string) => void;
};

export function ValleySelector({
  valleys,
  selectedSlug,
  onSelect,
}: ValleySelectorProps) {
  return (
    <nav
      aria-label="Explore other valleys"
      className="border-t border-border bg-background"
    >
      <ul className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 py-10 sm:gap-8 sm:px-12 sm:py-12 lg:justify-center lg:px-20">
        {valleys.map((valley) => {
          const isSelected = valley.slug === selectedSlug;

          return (
            <li key={valley.slug} className="shrink-0 snap-start">
              <button
                type="button"
                onClick={() => onSelect(valley.slug)}
                onMouseEnter={() => onSelect(valley.slug)}
                onFocus={() => onSelect(valley.slug)}
                aria-pressed={isSelected}
                className={cn(
                  "flex w-36 flex-col items-center gap-3 rounded-lg text-center transition-opacity duration-fast focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring sm:w-40",
                  isSelected ? "opacity-100" : "opacity-75 hover:opacity-100",
                )}
              >
                <span className="relative block aspect-4/3 w-full overflow-hidden rounded-lg bg-cloud">
                  {valley.coverImage ? (
                    <Image
                      src={valley.coverImage}
                      alt=""
                      fill
                      sizes="160px"
                      quality={80}
                      className="object-cover"
                    />
                  ) : null}
                </span>

                <span className="flex flex-col items-center gap-1.5">
                  <span className="text-xs font-medium uppercase tracking-[0.16em] text-foreground">
                    {valley.name}
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "h-px w-6 bg-gold transition-opacity duration-fast",
                      isSelected ? "opacity-100" : "opacity-0",
                    )}
                  />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
