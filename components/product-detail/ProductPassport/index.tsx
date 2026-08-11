import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import type { Product } from "@/lib/content/product";

type ProductPassportProps = {
  passport: Product["productPassport"];
};

type PassportFact = {
  label: string;
  value: string;
};

export function ProductPassport({ passport }: ProductPassportProps) {
  const facts = (
    [
      { label: "Origin", value: passport.region },
      passport.altitude
        ? { label: "Altitude", value: passport.altitude }
        : null,
      passport.harvestSeason
        ? { label: "Season", value: passport.harvestSeason }
        : null,
      passport.community
        ? { label: "Producer", value: passport.community }
        : null,
      passport.traceabilityCode
        ? { label: "Traceability", value: passport.traceabilityCode }
        : null,
      passport.coordinates
        ? {
            label: "Coordinates",
            value: `${passport.coordinates.lat}, ${passport.coordinates.lng}`,
          }
        : null,
    ] satisfies Array<PassportFact | null>
  ).filter((fact): fact is PassportFact => fact !== null);

  const columnBreak = Math.ceil(facts.length / 2);
  const columns = [facts.slice(0, columnBreak), facts.slice(columnBreak)];

  return (
    <Section aria-labelledby="product-passport-title" background="surface">
      <Container>
        <Heading
          eyebrow="Product Passport"
          title={<span id="product-passport-title">A record of origin</span>}
          className="mb-12 md:mb-16"
        />

        <dl className="grid gap-x-16 md:grid-cols-2 xl:gap-x-24">
          {columns.map((column, columnIndex) => (
            <div key={columnIndex}>
              {column.map((fact) => (
                <div
                  key={fact.label}
                  className="grid gap-2 border-b border-border py-6 sm:grid-cols-[minmax(8rem,1fr)_minmax(0,2fr)] sm:items-baseline sm:gap-8 md:py-7"
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
      </Container>
    </Section>
  );
}
