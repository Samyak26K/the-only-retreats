import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import type { Product } from "@/lib/content/product";
import { cn } from "@/lib/utils";

type ProductJourneyProps = {
  steps: Product["originJourney"];
};

export function ProductJourney({ steps }: ProductJourneyProps) {
  if (steps.length === 0) {
    return null;
  }

  return (
    <Section aria-labelledby="product-journey-title">
      <Container>
        <Heading
          eyebrow="Origin Journey"
          title={
            <span id="product-journey-title">
              From the Himalayas, with care
            </span>
          }
          subtitle="A patient passage from source to home, shaped by place, craft, and the people who preserve both."
          className="mb-16 md:mb-24"
        />

        <ol className="relative before:absolute before:inset-y-0 before:left-3 before:w-px before:bg-gold/70 md:before:left-1/2">
          {steps.map((step, index) => {
            const alignsLeft = index % 2 === 0;

            return (
              <li
                key={step.id}
                className="relative grid pb-16 last:pb-0 motion-safe:animate-[hero-rise_600ms_ease-out_both] motion-safe:[animation-range:entry_10%_cover_30%] motion-safe:[animation-timeline:view()] md:grid-cols-2 md:pb-24"
              >
                <span
                  aria-hidden="true"
                  className="absolute left-3 z-10 size-3 -translate-x-1/2 rounded-full border-2 border-gold bg-background md:left-1/2"
                />

                <article
                  className={cn(
                    "ml-12 max-w-lg",
                    alignsLeft
                      ? "md:col-start-1 md:ml-0 md:justify-self-end md:pr-16 md:text-right"
                      : "md:col-start-2 md:ml-0 md:pl-16",
                  )}
                >
                  <p className="text-xs font-medium tracking-[0.24em] text-gold">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-4 font-display text-3xl leading-tight tracking-[-0.03em] text-foreground md:text-4xl">
                    {step.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-muted md:text-base md:leading-8">
                    {step.description}
                  </p>
                </article>
              </li>
            );
          })}
        </ol>
      </Container>
    </Section>
  );
}
