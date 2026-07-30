import Image from "next/image";

import type { CollectionProduct } from "@/lib/content/collection";

type ProductFeatureCardProps = {
  product: CollectionProduct;
};

export function ProductFeatureCard({ product }: ProductFeatureCardProps) {
  return (
    <article className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12 xl:gap-16">
      <div className="order-1 overflow-hidden rounded-lg border border-border bg-surface lg:order-none">
        <Image
          src={product.image}
          alt={product.name}
          width={1200}
          height={900}
          className="h-auto w-full object-cover"
          priority={false}
        />
      </div>

      <div className="flex flex-col gap-4 sm:gap-5">
        <div className="space-y-2">
          <p className="text-[0.75rem] uppercase tracking-[0.28em] text-muted">
            Featured Product
          </p>
          <h3 className="font-display text-[clamp(2rem,3vw,3.75rem)] leading-[0.95] tracking-[-0.04em] text-foreground">
            {product.name}
          </h3>
        </div>

        <p className="font-body text-base leading-7 text-muted sm:text-lg sm:leading-8">
          {product.tagline}
        </p>

        <p className="max-w-xl text-sm leading-7 text-muted sm:text-base sm:leading-8">
          {product.description}
        </p>

        <div className="pt-2">
          <a
            href={product.href}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-transparent bg-primary px-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/80 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {product.cta}
          </a>
        </div>
      </div>
    </article>
  );
}
