import {
  Award,
  BadgeCheck,
  Leaf,
  MapPin,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import type { Product } from "@/lib/content/product";

type ProductCertificationsProps = {
  certifications: Product["certifications"];
};

const iconMap: Record<string, LucideIcon> = {
  leaf: Leaf,
  "map-pin": MapPin,
  mappin: MapPin,
  award: Award,
  "badge-check": BadgeCheck,
  badgecheck: BadgeCheck,
  "shield-check": ShieldCheck,
  shieldcheck: ShieldCheck,
};

function resolveIcon(identifier: string): LucideIcon {
  const key = identifier.trim().toLowerCase().replace(/\s+/g, "-");
  return iconMap[key] ?? ShieldCheck;
}

export function ProductCertifications({
  certifications,
}: ProductCertificationsProps) {
  if (certifications.length === 0) {
    return null;
  }

  return (
    <Section aria-labelledby="product-certifications-title">
      <Container>
        <Heading
          eyebrow="Certifications"
          title={
            <span id="product-certifications-title">Integrity, verified</span>
          }
          className="mb-12 md:mb-16"
        />

        <ul className="grid gap-12 border-t border-border pt-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-12 lg:gap-y-16">
          {certifications.map((certification) => {
            const Icon = resolveIcon(certification.icon);

            return (
              <li
                key={certification.id}
                className="motion-safe:animate-[hero-rise_600ms_ease-out_both] motion-safe:[animation-range:entry_10%_cover_30%] motion-safe:[animation-timeline:view()]"
              >
                <article>
                  <Icon
                    className="size-5 text-gold"
                    aria-hidden="true"
                    strokeWidth={1.5}
                  />
                  <h3 className="mt-5 font-heading text-xl leading-tight text-foreground">
                    {certification.title}
                  </h3>
                  <p className="mt-3 max-w-sm text-sm leading-7 text-muted">
                    {certification.description}
                  </p>
                </article>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
