import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import type { Product } from "@/lib/content/product";

type ProductRitualGuideProps = {
  ritualGuide: Product["ritualGuide"];
};

export function ProductRitualGuide({ ritualGuide }: ProductRitualGuideProps) {
  if (ritualGuide.steps.length === 0) {
    return null;
  }

  return (
    <Section aria-labelledby="product-ritual-title" background="surface">
      <Container>
        <Heading
          eyebrow="Ritual Guide"
          title={<span id="product-ritual-title">{ritualGuide.title}</span>}
          subtitle={ritualGuide.intro}
          className="mb-12 max-w-3xl md:mb-16"
        />

        <ol className="border-t border-border">
          {ritualGuide.steps.map((step) => (
            <li
              key={step.id}
              className="grid gap-4 border-b border-border py-10 motion-safe:animate-[hero-rise_600ms_ease-out_both] motion-safe:[animation-range:entry_10%_cover_30%] motion-safe:[animation-timeline:view()] md:grid-cols-[6rem_minmax(0,1fr)] md:items-start md:gap-12 md:py-14"
            >
              <p className="text-xs font-medium tracking-[0.24em] text-gold">
                {String(step.step).padStart(2, "0")}
              </p>
              <div className="max-w-2xl">
                <h3 className="font-display text-3xl leading-tight tracking-[-0.03em] text-foreground md:text-4xl">
                  {step.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-muted md:text-base md:leading-8">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>

        {ritualGuide.tips && ritualGuide.tips.length > 0 ? (
          <ul className="mt-10 space-y-3 md:mt-12">
            {ritualGuide.tips.map((tip) => (
              <li key={tip} className="max-w-2xl text-sm leading-7 text-muted">
                {tip}
              </li>
            ))}
          </ul>
        ) : null}
      </Container>
    </Section>
  );
}
