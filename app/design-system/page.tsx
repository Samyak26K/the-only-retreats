import { Container } from "@/components/ui/Container";
import { Divider } from "@/components/ui/Divider";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

export default function DesignSystemPage() {
  return (
    <main>
      <Section>
        <Container className="space-y-10">
          <Heading
            eyebrow="Layout primitives"
            title="Container"
            subtitle="Centered content with a 1280px max width and responsive horizontal padding."
          />
          <div className="rounded-(--radius-extra-large) border border-border bg-surface p-6 sm:p-8">
            <Container className="rounded-(--radius-large) border border-border bg-background py-6 text-center text-sm text-muted">
              Container
            </Container>
          </div>
        </Container>
      </Section>

      <Section background="surface">
        <Container className="space-y-10">
          <Heading
            eyebrow="Layout primitives"
            title="Section"
            subtitle="Responsive vertical spacing with optional semantic background treatment."
          />
          <div className="rounded-(--radius-extra-large) border border-border bg-background p-6 sm:p-8">
            <Section
              background="transparent"
              className="rounded-(--radius-large) border border-border bg-background"
            >
              <Container className="text-center text-sm text-muted">
                Section
              </Container>
            </Section>
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="space-y-10">
          <Heading
            eyebrow="Typography"
            title="Heading"
            subtitle="Editorial hierarchy with eyebrow, title, subtitle, and alignment control."
          />
          <div className="space-y-8 rounded-(--radius-extra-large) border border-border bg-surface p-6 sm:p-8">
            <Heading
              eyebrow="Heritage details"
              title="The mountain story, told with restraint"
              subtitle="A reusable editorial heading for premium content, storytelling blocks, and section intros."
            />
            <Divider variant="short" />
            <Heading
              eyebrow="Centered alignment"
              title="Refined and balanced"
              subtitle="Use centered alignment for feature-led sections and calm editorial compositions."
              alignment="center"
            />
            <Divider variant="center" />
            <Heading
              eyebrow="Right aligned"
              title="Measured and deliberate"
              subtitle="Right alignment supports selective emphasis without introducing visual noise."
              alignment="right"
            />
          </div>
        </Container>
      </Section>

      <Section background="surface">
        <Container className="space-y-10">
          <Heading
            eyebrow="Separators"
            title="Divider"
            subtitle="Simple horizontal dividers for editorial rhythm and section breaks."
          />
          <div className="space-y-6 rounded-(--radius-extra-large) border border-border bg-background p-6 sm:p-8">
            <Divider variant="short" />
            <Divider variant="center" />
            <Divider variant="long" />
          </div>
        </Container>
      </Section>
    </main>
  );
}
