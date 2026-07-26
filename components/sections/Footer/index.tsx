import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export function FooterSection() {
  return (
    <Section background="surface">
      <Container>
        <div className="py-12 text-center text-sm text-muted">
          Footer Section
        </div>
      </Container>
    </Section>
  );
}
