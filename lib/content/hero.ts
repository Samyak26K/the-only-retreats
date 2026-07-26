export interface HeroContent {
  title: string;
  subtitle: string;
  shloka: string;
  primaryCTA: {
    label: string;
    href: string;
  };
  secondaryCTA: {
    label: string;
    href: string;
  };
  backgroundImage: string;
}

export const heroContent: HeroContent = {
  title: "Pure Heritage from the High Himalayas",
  subtitle:
    "Authentic products sourced from the mountains, crafted with intention.",
  shloka: "The mountains are ancient teachers. We listen. We learn. We share.",
  primaryCTA: {
    label: "Explore Collection",
    href: "#collection",
  },
  secondaryCTA: {
    label: "Our Story",
    href: "#origins",
  },
  backgroundImage: "/images/hero-himalayan-landscape.jpg",
};
