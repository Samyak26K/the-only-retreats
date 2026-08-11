"use client";

import { useId, useState } from "react";

import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import type { Product } from "@/lib/content/product";
import { cn } from "@/lib/utils";

type ProductFAQProps = {
  faqs: Product["faqs"];
};

export function ProductFAQ({ faqs }: ProductFAQProps) {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(null);

  if (faqs.length === 0) {
    return null;
  }

  return (
    <Section aria-labelledby="product-faq-title">
      <Container>
        <Heading
          eyebrow="Questions"
          title={<span id="product-faq-title">Quiet answers</span>}
          className="mb-12 max-w-3xl md:mb-16"
        />

        <div className="border-t border-border">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            const panelId = `${baseId}-${faq.id}-panel`;
            const buttonId = `${baseId}-${faq.id}-button`;

            return (
              <div
                key={faq.id}
                className="border-b border-border motion-safe:animate-[hero-rise_600ms_ease-out_both] motion-safe:[animation-range:entry_10%_cover_30%] motion-safe:[animation-timeline:view()]"
              >
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() =>
                      setOpenId((current) =>
                        current === faq.id ? null : faq.id,
                      )
                    }
                    className="flex w-full items-start justify-between gap-6 py-7 text-left transition-colors duration-normal hover:text-forest focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 md:py-8"
                  >
                    <span className="font-heading text-lg leading-snug text-foreground md:text-xl">
                      {faq.question}
                    </span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "mt-1 shrink-0 text-gold transition-transform duration-normal",
                        isOpen && "rotate-45",
                      )}
                    >
                      +
                    </span>
                  </button>
                </h3>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  aria-hidden={!isOpen}
                  inert={!isOpen ? true : undefined}
                  className={cn(
                    "grid overflow-hidden transition-[grid-template-rows,opacity] duration-normal ease-out",
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="min-h-0">
                    <p className="max-w-2xl pb-7 text-sm leading-7 text-muted md:pb-8 md:text-base md:leading-8">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
