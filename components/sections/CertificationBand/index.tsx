import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import {
  certificationSection,
  certifications,
} from "@/lib/content/certifications";

import { CertificationItem } from "./CertificationItem";

export function CertificationBandSection() {
  return (
    <Section className="pt-10 md:pt-14 xl:pt-16">
      <Container className="space-y-6 sm:space-y-8">
        <Heading
          title={certificationSection.title}
          subtitle={certificationSection.subtitle}
          alignment="center"
          className="mx-auto"
        />

        <div className="grid grid-cols-2 gap-4 md:flex md:flex-wrap md:justify-center lg:flex-nowrap">
          {certifications.map((certification) => (
            <CertificationItem
              key={certification.name}
              certification={certification}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
