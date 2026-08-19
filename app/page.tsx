import { CertificationBandSection } from "@/components/sections/CertificationBand";
import { CollectionSection } from "@/components/sections/Collection";
import { FooterSection } from "@/components/sections/Footer";
import { FounderSection } from "@/components/sections/Founder";
import { HeritageSection } from "@/components/sections/Heritage";
import { HeroSection } from "@/components/sections/Hero";
import { OriginsSection } from "@/components/sections/Origins";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <OriginsSection />
      <CertificationBandSection />
      <CollectionSection />
      <HeritageSection />
      <FounderSection />
      <FooterSection />
    </>
  );
}
