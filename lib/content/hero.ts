export interface SanskritVerse {
  devanagari: string;
  transliteration: string;
  translation: string;
  context: string;
}

export interface HeroMedia {
  desktop: string;
  mobile: string;
  alt: string;
}

export interface HeroContent {
  shloka: SanskritVerse;
  title: string;
  titleEmphasis: string;
  supporting: string;
  cta: {
    label: string;
    href: string;
  };
  scrollCue: string;
  media: HeroMedia;
}

export const heroContent: HeroContent = {
  shloka: {
    devanagari: "सर्वे भवन्तु सुखिनः।",
    transliteration: "Sarve Bhavantu Sukhinah",
    translation: "May all beings be nourished.",
    context:
      "An ancient Sanskrit blessing expressing the wish that all beings live with well-being, nourishment, and peace. It reflects the philosophy behind The Only Retreats: sharing authentic Himalayan nourishment with care, respect, and harmony with nature.",
  },
  title: "The Himalayas are not a destination.",
  titleEmphasis: "They are a source.",
  supporting: "Not mass produced. Only preserved.",
  cta: {
    label: "Enter the Source",
    href: "#origins",
  },
  scrollCue: "Begin the descent",
  media: {
    desktop: "/images/hero/hero-v1.webp",
    mobile: "/images/hero/hero-mobile.webp",
    alt: "Mist rising over a high Himalayan valley at first light.",
  },
};
