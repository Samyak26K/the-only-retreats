import { Container } from "@/components/ui/Container";
import type { Product } from "@/lib/content/product";

type Props = {
  passport: Product["productPassport"];
};

type PassportFact = {
  label: string;
  value: string;
  icon: string;
};

export function ProductPassport({ passport }: Props) {
  const facts = [
    passport.region && {
      label: "Origin",
      value: passport.region,
      icon: "◎",
    },
    passport.altitude && {
      label: "Altitude",
      value: passport.altitude,
      icon: "▲",
    },
    passport.harvestSeason && {
      label: "Harvest Season",
      value: passport.harvestSeason,
      icon: "◈",
    },
    passport.community && {
      label: "Producer",
      value: passport.community,
      icon: "◇",
    },
    passport.traceabilityCode && {
      label: "Batch Code",
      value: passport.traceabilityCode,
      icon: "◻",
    },
    passport.coordinates && {
      label: "Coordinates",
      value: `${passport.coordinates.lat}, ${passport.coordinates.lng}`,
      icon: "◉",
    },
  ].filter(Boolean) as PassportFact[];

  if (facts.length === 0) return null;

  return (
    <section className="border-t border-border bg-surface py-12 md:py-16">
      <Container>
        <div className="mb-8">
          <p className="mb-2 text-[0.6rem] uppercase tracking-[0.24em] text-muted">
            Product Passport
          </p>
          <h2 className="font-display text-2xl tracking-[-0.02em] text-foreground md:text-3xl">
            A record of origin
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {facts.map((fact) => (
            <div
              key={fact.label}
              className="space-y-1.5 rounded-xl border border-border bg-background p-4"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs text-gold">{fact.icon}</span>
                <p className="text-[0.6rem] uppercase tracking-[0.15em] text-muted">
                  {fact.label}
                </p>
              </div>
              <p className="font-heading text-sm leading-snug font-medium text-foreground">
                {fact.value}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
