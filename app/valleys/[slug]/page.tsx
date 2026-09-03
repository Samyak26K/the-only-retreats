import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { FooterSection } from "@/components/sections/Footer";
import { Container } from "@/components/ui/Container";
import { valleys } from "@/lib/content/valleys";

export const dynamic = "force-static";
export const revalidate = 3600;

type ValleyPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ValleyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const valley = valleys.find((v) => v.slug === slug);

  if (!valley) {
    return {};
  }

  return {
    title: valley.name + " — The Only Retreats",
    description: valley.editorialTitle,
  };
}

export default async function ValleyPage({ params }: ValleyPageProps) {
  const { slug } = await params;
  const valley = valleys.find((v) => v.slug === slug);

  if (!valley) {
    notFound();
  }

  const meta = [valley.state, valley.altitude].filter(Boolean).join(" · ");

  return (
    <>
      <section className="relative overflow-hidden bg-forest">
        <div
          aria-hidden="true"
          className="h-(--navbar-height-mobile) md:h-(--navbar-height-tablet) lg:h-(--navbar-height-desktop)"
        />

        {valley.coverImage ? (
          <Image
            src={valley.coverImage}
            alt={valley.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : null}

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-forest/90 to-transparent"
        />

        <Container className="relative z-10 py-20 md:py-28 lg:py-32">
          <h1 className="max-w-4xl font-display text-[clamp(3rem,10vw,7.5rem)] leading-[0.9] tracking-[-0.04em] text-white">
            {valley.name}
          </h1>
          <p
            lang="sa"
            className="mt-6 max-w-2xl font-sanskrit text-lg text-gold md:text-2xl"
          >
            {valley.shloka.sanskrit}
          </p>
          <p className="mt-3 font-display text-lg text-white/80 italic md:text-xl">
            {valley.editorialTitle}
          </p>
          {meta ? (
            <p className="mt-8 text-xs uppercase tracking-[0.2em] text-white/60">
              {meta}
            </p>
          ) : null}
        </Container>
      </section>

      <section className="bg-background py-20 md:py-28">
        <Container>
          <div className="mx-auto max-w-3xl">
            <p className="text-xs uppercase tracking-[0.24em] text-muted">
              THE VALLEY
            </p>
            <p className="mt-8 font-body text-lg leading-8 text-foreground/80 md:text-xl md:leading-9">
              {valley.shortDescription ??
                `${valley.name} is one of the origins we work with — a place shaped by altitude, season, and the people who tend it. ${valley.editorialTitle}. The full story of this landscape is still being written with the families who live it.`}
            </p>
          </div>
        </Container>
      </section>

      {valley.products.length > 0 ? (
        <section className="bg-background pb-20 md:pb-28">
          <Container>
            <h2 className="font-display text-4xl tracking-[-0.03em] text-foreground md:text-5xl">
              From This Valley
            </h2>
            <ul className="mt-10 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3">
              {valley.products.map((product) => (
                <li key={product.slug}>
                  <Link
                    href={`/products/${product.slug}`}
                    className="group flex items-center justify-between rounded-xl border border-border bg-surface p-6 transition-colors hover:border-gold"
                  >
                    <span className="font-heading text-base font-medium text-foreground">
                      {product.name}
                    </span>
                    <ArrowRight className="size-4 text-muted transition-transform group-hover:translate-x-1 group-hover:text-gold" />
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      <section className="bg-background pb-16">
        <Container>
          <Link
            href="/#origins"
            className="text-sm text-muted transition-colors hover:text-foreground"
          >
            ← All Origins
          </Link>
        </Container>
      </section>

      <FooterSection />
    </>
  );
}
