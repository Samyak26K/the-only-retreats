const items = [
  "The Only Retreats",
  "Not Mass Produced. Only Preserved.",
  "Organic Certified",
  "Fair Trade",
  "Traceable Source",
  "Sustainable",
  "Small Batch",
  "Direct from Himalaya",
  "No Additives",
  "Lab Tested",
  "Single Origin",
  "Ancient Methods",
  "The Only Retreats",
  "Not Mass Produced. Only Preserved.",
];

const separator = "✦";

export function CertificationBandSection() {
  return (
    <div className="overflow-hidden border-y border-gold/20 bg-forest py-4">
      <div className="animate-marquee flex whitespace-nowrap">
        {[...items, ...items, ...items].map((item, index) => (
          <span key={index} className="inline-flex items-center gap-4 px-4">
            <span className="text-xs font-medium tracking-[0.25em] text-background/90 uppercase">
              {item}
            </span>
            <span className="text-xs text-gold">{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
