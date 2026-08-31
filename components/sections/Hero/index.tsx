import { getImageProps } from "next/image";
import Link from "next/link";

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
      className="relative flex min-h-svh w-full items-center overflow-hidden bg-linear-to-b from-[#3f3a30] to-[#211e19]"
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

      <div className="relative z-10 w-full py-16 pt-[calc(var(--navbar-height-mobile)+2rem)] md:pt-[calc(var(--navbar-height-tablet)+2rem)] lg:pt-[calc(var(--navbar-height-desktop)+2rem)]">
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
              <span
                className="block font-sanskrit text-background/90"
                style={{ fontStyle: "italic", letterSpacing: "0.02em" }}
              >
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
              <div className="flex flex-col sm:flex-row gap-4 items-start mt-2">
                {/* Primary CTA */}
                <Link
                  href="/products"
                  className="group inline-flex items-center gap-3 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm px-7 py-3.5 text-xs uppercase tracking-[0.25em] text-white transition-all duration-300 hover:bg-white hover:text-foreground hover:border-white"
                >
                  <span>Discover the Source</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>

                {/* Secondary CTA */}
                <Link
                  href="/our-story"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors duration-300 pt-3.5"
                >
                  <span className="w-6 h-px bg-white/40 group-hover:w-10 transition-all" />
                  Our Story
                </Link>
              </div>
            </div>
          </div>
        </Container>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 motion-safe:animate-[hero-rise_1.2s_ease-out_forwards] motion-safe:opacity-0 motion-safe:[animation-delay:800ms]">
          <p className="text-[0.55rem] uppercase tracking-[0.4em] text-white/40">
            Begin the descent
          </p>
          <div className="flex flex-col items-center gap-1">
            <div className="w-px h-6 bg-white/20 animate-pulse" />
            <div className="w-px h-3 bg-white/10" />
          </div>
        </div>
      </div>
    </section>
  );
}
