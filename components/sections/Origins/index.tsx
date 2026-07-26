import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { originsContent, originsSection } from "@/lib/content/origins";
import { ValleyCard } from "./ValleyCard";

export function OriginsSection() {
  return (
    <Section id="origins" background="surface">
      <Container className="space-y-12">
        <div className="space-y-4 sm:space-y-6">
          <Heading
            title={originsSection.title}
            subtitle={originsSection.subtitle}
            alignment="center"
            className="mx-auto"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {originsContent.map((valley) => (
            <ValleyCard key={valley.id} valley={valley} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
