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
            {/* Block 1: Sanskrit opener — quiet, small */}
            <div
              className={`flex flex-col gap-1.5 
              motion-safe:animate-[hero-rise_1.2s_ease-out_forwards] 
              motion-safe:opacity-0 ${entranceDelays[0]}`}
            >
              <p
                lang="sa"
                className="font-sanskrit text-base tracking-wide 
                  text-white/70 sm:text-lg"
              >
                {heroContent.shloka.devanagari}
              </p>
              <p className="text-sm font-medium text-background/85">
                {heroContent.shloka.translation}
              </p>
            </div>

            {/* Block 2: Primary H1 — dominant brand statement */}
            <h1
              className={`mt-3 font-display font-medium uppercase
              text-[clamp(1.8rem,4vw,3.2rem)] leading-[1.05] 
              tracking-[0.04em] text-background
              motion-safe:animate-[hero-rise_1.2s_ease-out_forwards] 
              motion-safe:opacity-0 ${entranceDelays[1]}`}
            >
              <span className="block">{heroContent.title}</span>
              <span className="block">{heroContent.titleEmphasis}</span>
            </h1>

            {/* Block 3: Editorial continuation — italic, medium */}
            <p
              className={`max-w-lg font-display
              text-lg md:text-xl text-background/80 leading-snug
              motion-safe:animate-[hero-rise_1.2s_ease-out_forwards] 
              motion-safe:opacity-0 ${entranceDelays[2]}`}
            >
              {heroContent.editorial.split("\n").map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </p>

            {/* Block 4: Closing brand line — restrained */}
            <p
              className={`text-sm text-background/60 
              tracking-[0.05em] uppercase
              motion-safe:animate-[hero-rise_1.2s_ease-out_forwards] 
              motion-safe:opacity-0 ${entranceDelays[2]}`}
              style={{ animationDelay: "350ms" }}
            >
              {heroContent.supporting}
            </p>

            {/* Block 5: CTAs — unchanged */}
            <div
              className={`flex flex-col lg:flex-row gap-4 
              items-start mt-2
              motion-safe:animate-[hero-rise_1.2s_ease-out_forwards] 
              motion-safe:opacity-0 ${entranceDelays[3]}`}
            >
              <Link
                href="/products"
                className="group inline-flex items-center gap-3 
                  rounded-full border border-white/30 bg-white/10 
                  backdrop-blur-sm px-7 py-3.5 text-xs uppercase 
                  tracking-[0.25em] text-white transition-all duration-300
                  hover:bg-white hover:text-foreground hover:border-white"
              >
                <span>Discover the Source</span>
                <span
                  className="transition-transform duration-300 
                  group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>

              <Link
                href="/our-story"
                className="inline-flex items-center gap-2 
                  text-xs uppercase tracking-[0.2em] text-white/60
                  hover:text-white transition-colors duration-300 
                  pt-3.5"
              >
                <span className="w-6 h-px bg-white/40" />
                Our Story
              </Link>
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
