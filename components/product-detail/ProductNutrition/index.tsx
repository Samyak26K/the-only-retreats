import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import type { Product } from "@/lib/content/product";

type ProductNutritionProps = {
  nutrition: Product["nutrition"];
};

type NutritionFact = {
  label: string;
  value: string;
};

export function ProductNutrition({ nutrition }: ProductNutritionProps) {
  const facts = nutrition.facts;

  if (facts.length === 0) {
    return null;
  }

  const columnBreak = Math.ceil(facts.length / 2);
  const columns: NutritionFact[][] = [
    facts.slice(0, columnBreak),
    facts.slice(columnBreak),
  ];

  return (
    <Section aria-labelledby="product-nutrition-title" background="surface">
      <Container>
        <Heading
          eyebrow="Nutrition"
          title={<span id="product-nutrition-title">What nourishes you</span>}
          subtitle={`Serving size · ${nutrition.servingSize}`}
          className="mb-12 md:mb-16"
        />

        <dl className="grid gap-x-16 md:grid-cols-2 xl:gap-x-24">
          {columns.map((column, columnIndex) => (
            <div key={columnIndex}>
              {column.map((fact) => (
                <div
                  key={fact.label}
                  className="grid gap-2 border-b border-border py-6 motion-safe:animate-[hero-rise_600ms_ease-out_both] motion-safe:[animation-range:entry_10%_cover_30%] motion-safe:[animation-timeline:view()] sm:grid-cols-[minmax(8rem,1fr)_minmax(0,2fr)] sm:items-baseline sm:gap-8 md:py-7"
                >
                  <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                    {fact.label}
                  </dt>
                  <dd className="font-heading text-lg leading-7 text-foreground">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </div>
          ))}
        </dl>

        {nutrition.allergens && nutrition.allergens.length > 0 ? (
          <p className="mt-10 text-sm leading-7 text-muted">
            <span className="font-semibold uppercase tracking-[0.18em] text-foreground/70">
              Allergens
            </span>
            <span className="mx-3 text-border" aria-hidden="true">
              —
            </span>
            {nutrition.allergens.join(", ")}
          </p>
        ) : null}

        {nutrition.disclaimer ? (
          <p className="mt-4 max-w-2xl text-xs leading-6 text-muted">
            {nutrition.disclaimer}
          </p>
        ) : null}
      </Container>
    </Section>
  );
}
