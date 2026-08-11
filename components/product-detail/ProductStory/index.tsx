import { Container } from "@/components/ui/Container";
import { Divider } from "@/components/ui/Divider";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import type { Product } from "@/lib/content/product";

type ProductStoryProps = {
  story: Product["story"];
};

export function ProductStory({ story }: ProductStoryProps) {
  return (
    <Section aria-labelledby="product-story-title">
      <Container>
        <article className="mx-auto max-w-4xl">
          <Heading
            eyebrow={story.eyebrow}
            title={<span id="product-story-title">{story.title}</span>}
            className="max-w-4xl"
          />

          <Divider variant="short" className="my-8 border-gold md:my-10" />

          <p className="max-w-3xl font-body text-lg leading-8 text-muted md:text-xl md:leading-9">
            {story.body}
          </p>
        </article>
      </Container>
    </Section>
  );
}
