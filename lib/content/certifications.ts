export interface Certification {
  name: string;
  icon: string;
}

export interface CertificationSectionContent {
  title: string;
  subtitle: string;
}

export const certificationSection: CertificationSectionContent = {
  title: "Certifications",
  subtitle:
    "Ethical sourcing, traceability, and quality standards that protect the integrity of every product.",
};

export const certifications: Certification[] = [
  {
    name: "Organic Certified",
    icon: "/icons/organic.svg",
  },
  {
    name: "Fair Trade",
    icon: "/icons/fair-trade.svg",
  },
  {
    name: "Traceable Source",
    icon: "/icons/traceable.svg",
  },
  {
    name: "Sustainable",
    icon: "/icons/sustainable.svg",
  },
];
