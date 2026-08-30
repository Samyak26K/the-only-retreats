import { CertificationBandSection } from "@/components/sections/CertificationBand";
import { CollectionSection } from "@/components/sections/Collection";
import { FooterSection } from "@/components/sections/Footer";
import { FounderSection } from "@/components/sections/Founder";
import { HeritageSection } from "@/components/sections/Heritage";
import { HeroSection } from "@/components/sections/Hero";
import { OriginsSection } from "@/components/sections/Origins";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <RevealOnScroll delay={0}>
        <OriginsSection />
      </RevealOnScroll>
      <RevealOnScroll delay={100}>
        <CertificationBandSection />
      </RevealOnScroll>
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
