import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/Container";

const processSteps = [
  {
    number: "01",
    title: "The Herd",
    description:
      "Yaks graze freely at 12,000 feet on sparse alpine grasslands.",
  },
  {
    number: "02",
    title: "The Milk",
    description: "Collected by hand each morning by herding families.",
  },
  {
    number: "03",
    title: "The Churn",
    description: "Hand-churned using traditional wooden bilona method.",
  },
  {
    number: "04",
    title: "The Clarify",
    description: "Slow-clarified over wood fire until golden and pure.",
  },
];

export function HeritageSection() {
  return (
    <section
      id="heritage"
      className="pt-12 md:pt-28 pb-12 md:pb-16"
      style={{
        backgroundColor: "#1a2a1f",
        backgroundImage: "url('/topo.svg')",
        backgroundRepeat: "repeat",
        backgroundSize: "600px 600px",
      }}
    >
      <Container>
        {/* Section header */}
        <div className="mb-10 md:mb-14">
          <p className="mb-3 text-xs uppercase tracking-[0.24em] text-gold/70">
            HERITAGE: YAK GHEE
          </p>
          <h2 className="max-w-3xl font-display text-4xl leading-[0.95] tracking-[-0.03em] text-white/95 md:text-6xl lg:text-7xl">
            A tradition passed down.
            <br />
            <span className="italic">A process preserved.</span>
          </h2>
        </div>

        {/* Main content grid */}
        <div className="mb-12 grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left: Two stacked images */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="relative aspect-[3/4] min-h-[200px] overflow-hidden rounded-2xl">
              <Image
                src="https://res.cloudinary.com/k7cipxug/image/upload/v1787128317/yak_Greazing.png"
                alt="Yak grazing in Himalayan highlands"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 25vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a2a1f]/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="text-xs tracking-wider text-white/60 uppercase">
                  The Herd
                </p>
              </div>
            </div>
            <div className="relative mt-8 aspect-[3/4] min-h-[200px] overflow-hidden rounded-2xl">
              <Image
                src="https://res.cloudinary.com/k7cipxug/image/upload/v1787128350/heritage_churning.png"
                alt="Traditional butter churning"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 25vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a2a1f]/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="text-xs tracking-wider text-white/60 uppercase">
                  The Churn
                </p>
              </div>
            </div>
          </div>

          {/* Right: Story */}
          <div className="space-y-8">
            <p className="font-body text-lg leading-8 text-white/70">
              Most ghee is industrially produced. Ours is not. From free-grazing
              yaks at 12,000 feet to the ancient Bilona method — every jar
              carries a tradition that cannot be mass produced.
            </p>

            <p className="font-body text-base leading-7 text-white/50">
              We work directly with herding families in Spiti Valley who have
              maintained these practices across generations. No intermediaries.
              No compromises. Every jar is traceable to the family that made it.
            </p>

            {/* Sanskrit quote */}
            <div className="border-l-2 border-gold/40 pl-6">
              <p lang="sa" className="font-sanskrit text-xl text-gold">
                गावो विश्वस्य मातरः
              </p>
              <p className="mt-2 text-sm text-white/40 italic">
                The cow is the mother of the world.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-6 border-t border-white/10 pt-8 sm:grid-cols-3">
              <div>
                <p className="font-display text-3xl text-white/90">12k</p>
                <p className="mt-1 text-xs tracking-wider text-white/30 uppercase">
                  Feet altitude
                </p>
              </div>
              <div>
                <p className="font-display text-3xl text-white/90">4</p>
                <p className="mt-1 text-xs tracking-wider text-white/30 uppercase">
                  Step process
                </p>
              </div>
              <div>
                <p className="font-display text-3xl text-white/90">100%</p>
                <p className="mt-1 text-xs tracking-wider text-white/30 uppercase">
                  Traceable
                </p>
              </div>
            </div>

            <Link
              href="/products"
              className="inline-flex items-center gap-3 rounded-full border border-gold/40 px-6 py-3 text-sm tracking-[0.2em] text-gold uppercase transition-colors hover:bg-gold/10"
            >
              Discover Our Ghee
            </Link>
          </div>
        </div>

        {/* Process steps */}
        <div className="grid grid-cols-1 gap-6 border-t border-white/10 pt-16 sm:grid-cols-2 md:grid-cols-4">
          {processSteps.map((step, index) => (
            <div key={step.number} className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="font-display text-4xl text-gold/30">
                  {step.number}
                </span>
                {index < processSteps.length - 1 && (
                  <div className="hidden h-px flex-1 bg-white/10 md:block" />
                )}
              </div>
              <p className="font-heading text-sm font-medium text-white/90">
                {step.title}
              </p>
              <p className="text-xs leading-5 text-white/40">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
