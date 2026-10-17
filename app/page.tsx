import { CertificationBandSection } from "@/components/sections/CertificationBand";
import { CollectionSection } from "@/components/sections/Collection";
import { BharatBhumiSection } from "@/components/sections/BharatBhumi";
import { FooterSection } from "@/components/sections/Footer";
import { FounderSection } from "@/components/sections/Founder";
import { HeritageSection } from "@/components/sections/Heritage";
import { HeroSection } from "@/components/sections/Hero";
import { OriginsSection } from "@/components/sections/Origins";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": "https://theonlyretreats.com/#organization",
                name: "The Only Retreats",
                url: "https://theonlyretreats.com",
                logo: {
                  "@type": "ImageObject",
                  url: "https://theonlyretreats.com/logo.png",
                },
                description:
                  "Authentic Himalayan nourishment — raw honey, Bilona ghee, Shilajit and heritage foods sourced directly from high-altitude valleys.",
                brand: {
                  "@type": "Brand",
                  name: "The Only Retreats",
                },
              },
              {
                "@type": "WebSite",
                "@id": "https://theonlyretreats.com/#website",
                url: "https://theonlyretreats.com",
                name: "The Only Retreats",
                description: "Not mass produced. Only preserved.",
                publisher: {
                  "@id": "https://theonlyretreats.com/#organization",
                },
                potentialAction: {
                  "@type": "SearchAction",
                  target: {
                    "@type": "EntryPoint",
                    urlTemplate:
                      "https://theonlyretreats.com/products?q={search_term_string}",
                  },
                  "query-input": "required name=search_term_string",
                },
              },
            ],
          }),
        }}
      />
      <HeroSection />
      <RevealOnScroll delay={0}>
        <OriginsSection />
      </RevealOnScroll>
      <RevealOnScroll delay={100}>
        <CertificationBandSection />
      </RevealOnScroll>
      <BharatBhumiSection />
      <RevealOnScroll delay={0}>
        <CollectionSection />
      </RevealOnScroll>
      <RevealOnScroll delay={0}>
        <HeritageSection />
      </RevealOnScroll>
      <RevealOnScroll delay={0}>
        <FounderSection />
      </RevealOnScroll>
      <FooterSection />
    </>
  );
}
