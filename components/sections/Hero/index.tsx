import { getImageProps } from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { heroContent } from "@/lib/content/hero";

const entranceDelays = [
  "motion-safe:[animation-delay:0ms]",
  "motion-safe:[animation-delay:150ms]",
  "motion-safe:[animation-delay:300ms]",
  "motion-safe:[animation-delay:450ms]",
] as const;

export function HeroSection() {
  const sharedProps = {
    alt: heroContent.media.alt,
    fill: true,
    priority: true,
    sizes: "100vw",
    className: "object-cover object-center",
  } as const;

  const {
    props: { srcSet: desktopSrcSet, sizes: desktopSizes },
  } = getImageProps({ ...sharedProps, src: heroContent.media.desktop });

  const { props: mobileImgProps } = getImageProps({
    ...sharedProps,
    src: heroContent.media.mobile,
  });

  return (
    <section
      id="journey"
      aria-label="Hero"
      className="relative flex min-h-svh w-full items-end overflow-hidden bg-linear-to-b from-[#3f3a30] to-[#211e19]"
    >
      <picture>
        <source
          media="(min-width: 768px)"
          srcSet={desktopSrcSet}
          sizes={desktopSizes}
        />
        <img
          {...mobileImgProps}
          alt={heroContent.media.alt}
          fetchPriority="high"
        />
      </picture>

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-black/10"
      />

      <div className="relative z-10 w-full pt-[calc(var(--navbar-height-mobile)+2rem)] pb-16 sm:pb-20 md:pt-[calc(var(--navbar-height-tablet)+3rem)] md:pb-24 lg:pt-[calc(var(--navbar-height-desktop)+4rem)]">
        <Container>
          <div className="flex max-w-2xl flex-col gap-4 md:gap-6">
            <div
              className={`flex flex-col gap-2 motion-safe:animate-[hero-rise_1.2s_ease-out_forwards] motion-safe:opacity-0 ${entranceDelays[0]}`}
            >
              <p
                lang="sa"
                className="font-sanskrit text-lg tracking-wide text-gold sm:text-xl"
              >
                {heroContent.shloka.devanagari}
              </p>
              <p className="sr-only">{heroContent.shloka.transliteration}</p>
              <p className="max-w-md text-sm text-background/80 sm:text-base">
                {heroContent.shloka.translation}
              </p>
            </div>

            <h1
              className={`mt-2 font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.98] tracking-[-0.02em] text-background motion-safe:animate-[hero-rise_1.2s_ease-out_forwards] motion-safe:opacity-0 sm:mt-3 ${entranceDelays[1]}`}
            >
              {heroContent.title}{" "}
              <span className="block italic text-background/90">
                {heroContent.titleEmphasis}
              </span>
            </h1>

            <p
              className={`max-w-md text-sm leading-7 text-background/85 sm:text-lg md:max-w-lg lg:max-w-xl motion-safe:animate-[hero-rise_1.2s_ease-out_forwards] motion-safe:opacity-0 ${entranceDelays[2]}`}
            >
              {heroContent.supporting}
            </p>

            <div
              className={`motion-safe:animate-[hero-rise_1.2s_ease-out_forwards] motion-safe:opacity-0 ${entranceDelays[3]}`}
            >
              <Link
                href={heroContent.cta.href}
                className="inline-flex h-12 items-center gap-2 rounded-lg bg-background px-6 text-sm font-medium uppercase tracking-[0.2em] text-forest transition-colors duration-fast hover:bg-background/90"
              >
                {heroContent.cta.label}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Container>

        <div className="mt-6 flex justify-center md:mt-16">
          <span className="text-xs uppercase tracking-[0.3em] text-background/70">
            {heroContent.scrollCue}
          </span>
        </div>
      </div>
    </section>
  );
}
