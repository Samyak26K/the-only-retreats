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
    icon: "/globe.svg",
  },
  {
    name: "Fair Trade",
    icon: "/globe.svg",
  },
  {
    name: "Traceable Source",
    icon: "/globe.svg",
  },
  {
    name: "Sustainable",
    icon: "/globe.svg",
  },
];
