import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import type { Product } from "@/lib/content/product";
import { cn } from "@/lib/utils";

type ProductTasteProfileProps = {
  tasteProfile: Product["tasteProfile"];
};

const MAX_INTENSITY = 5;

function IntensityDots({
  label,
  intensity,
}: {
  label: string;
  intensity: number;
}) {
  const clamped = Math.min(Math.max(intensity, 0), MAX_INTENSITY);

  return (
    <div
      role="img"
      aria-label={`${label} intensity ${clamped} of ${MAX_INTENSITY}`}
      className="flex items-center gap-1.5"
    >
      {Array.from({ length: MAX_INTENSITY }, (_, index) => (
        <span
          key={index}
          aria-hidden="true"
          className={cn(
            "size-1.5 rounded-full transition-colors duration-normal",
            index < clamped ? "bg-gold" : "bg-border",
          )}
        />
      ))}
    </div>
  );
}

export function ProductTasteProfile({
  tasteProfile,
}: ProductTasteProfileProps) {
  if (tasteProfile.attributes.length === 0) {
    return null;
  }

  return (
    <Section aria-labelledby="product-taste-title">
      <Container>
        <Heading
          eyebrow="Taste Profile"
          title={<span id="product-taste-title">A sensory reading</span>}
          subtitle={tasteProfile.summary}
          className="mb-12 max-w-3xl md:mb-16"
        />

        <ul className="grid gap-0 border-t border-border md:grid-flow-col md:auto-cols-fr">
          {tasteProfile.attributes.map((attribute) => (
            <li
              key={attribute.label}
              className="border-b border-border py-8 motion-safe:animate-[hero-rise_600ms_ease-out_both] motion-safe:[animation-range:entry_10%_cover_30%] motion-safe:[animation-timeline:view()] md:border-r md:border-b-0 md:px-6 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                {attribute.label}
              </p>
              <div className="mt-5">
                <IntensityDots
                  label={attribute.label}
                  intensity={attribute.intensity}
                />
              </div>
              <p className="mt-4 font-heading text-sm text-foreground">
                {attribute.intensity} / {MAX_INTENSITY}
              </p>
            </li>
          ))}
        </ul>

        {tasteProfile.pairings && tasteProfile.pairings.length > 0 ? (
          <p className="mt-10 text-sm leading-7 text-muted md:mt-12">
            <span className="font-semibold uppercase tracking-[0.18em] text-foreground/70">
              Pairings
            </span>
            <span className="mx-3 text-border" aria-hidden="true">
              —
            </span>
            {tasteProfile.pairings.join(" · ")}
          </p>
        ) : null}
      </Container>
    </Section>
  );
}
