import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mountain } from "lucide-react";

import { Container } from "@/components/ui/Container";
import type { Valley } from "@/lib/content/valleys";

type FeaturedValleyPanelProps = {
  valley: Valley;
};

export function FeaturedValleyPanel({ valley }: FeaturedValleyPanelProps) {
  const meta = [valley.state, valley.altitude].filter(Boolean).join(" · ");

  return (
    <div className="bg-background pt-16 pb-12 sm:pt-20 sm:pb-14 md:pt-24 md:pb-16">
      <Container>
        <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-2 lg:items-start lg:gap-x-10 xl:gap-x-14">
          <div>
            {valley.coverImage ? (
              <div className="relative aspect-4/3 overflow-hidden rounded-2xl">
                <Image
                  src={valley.coverImage}
                  alt={valley.name}
                  fill
                  sizes="(min-width: 1024px) 576px, 100vw"
                  quality={90}
                  className="object-cover"
                />
              </div>
            ) : (
              <div
                role="img"
                aria-label={`${valley.name} photography forthcoming`}
                className="mx-auto flex aspect-square w-28 items-center justify-center rounded-2xl border border-border bg-surface sm:w-32 lg:mx-0 lg:w-40"
              >
                <Mountain
                  className="size-8 text-muted/40 sm:size-9"
                  strokeWidth={1.25}
                  aria-hidden="true"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6 lg:pt-2 xl:pt-6">
            <div className="space-y-3">
              <h2
                id="origins-story"
                className="font-heading text-4xl leading-[1.05] tracking-[-0.01em] text-foreground sm:text-[2.75rem]"
              >
                {valley.name}
              </h2>
              <p
                lang="sa"
                className="font-sanskrit text-lg leading-relaxed text-gold sm:text-xl"
              >
                {valley.shloka.sanskrit}
              </p>
              <p className="font-display text-base leading-snug text-muted italic sm:text-lg">
                {valley.editorialTitle}
              </p>
            </div>

            {valley.shortDescription ? (
              <p className="max-w-md text-base leading-7 text-muted sm:text-lg">
                {valley.shortDescription}
              </p>
            ) : null}

            {meta ? (
              <p className="text-xs uppercase tracking-[0.2em] text-muted/70">
                {meta}
              </p>
            ) : null}

            {valley.products.length > 0 ? (
              <ul
                id="origins-harvests"
                className="flex flex-wrap items-center gap-x-2 gap-y-1"
                aria-label={`Products from ${valley.name}`}
              >
                {valley.products.map((product, index) => (
                  <li
                    key={product.slug}
                    className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-muted/60"
                  >
                    {index > 0 ? (
                      <span aria-hidden="true" className="text-border">
                        ·
                      </span>
                    ) : null}
                    {product.name}
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-2">
              <Link
                href="#origins-story"
                className="group inline-flex items-center gap-2 text-sm font-medium text-forest transition-colors duration-fast hover:text-forest/70"
              >
                View Story
                <ArrowRight
                  className="size-4 transition-transform duration-fast group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
              <Link
                href="#origins-harvests"
                className="group inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors duration-fast hover:text-foreground"
              >
                Explore Harvests
                <ArrowRight
                  className="size-4 transition-transform duration-fast group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
