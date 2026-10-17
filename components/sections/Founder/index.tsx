import Image from "next/image";
import { Leaf, Hand, Mountain } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { founderContent } from "@/lib/content/founder";

export function FounderSection() {
  return (
    <section id="founder" className="bg-background py-16 md:py-24">
      <Container>
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-24">
          {/* LEFT: Founder photo with logo overlay */}
          <div className="relative">
            <div className="relative aspect-[3/4] max-h-[700px] overflow-hidden rounded-2xl bg-surface">
              <Image
                src={founderContent.image}
                alt={founderContent.name}
                fill
                className="object-cover object-[center_20%]"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
              {/* Logo overlay bottom right of image */}
              <div className="absolute right-4 bottom-4 flex h-14 w-14 items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="The Only Retreats"
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* RIGHT: Content */}
          <div className="flex flex-col space-y-6">
            {/* Eyebrow */}
            <p className="text-[0.6rem] uppercase tracking-[0.28em] text-muted">
              Founder Story
            </p>

            {/* Pull quote */}
            <blockquote className="font-display text-2xl leading-[1.15] tracking-[-0.02em] text-foreground md:text-3xl lg:text-4xl">
              &ldquo;I did not set out to build a company. I set out to
              understand what keeps a human being truly grounded, conscious, and
              alive.&rdquo;
            </blockquote>

            {/* Gold divider */}
            <div className="h-px w-10 bg-gold" />

            {/* Story paragraph 1 */}
            <p className="font-body text-sm leading-7 text-muted md:text-base md:leading-8">
              At 17, I left familiar ground to experience life in its rawest
              form. Over a decade across 10 cities, 6 states, and 2 countries —
              from hosting thousands of global souls in India &amp; Dubai to
              walking alongside the artisan tribes, the high-altitude herding
              families of Garhwal, Kumaon, Himachal, and Ladakh, and the deep
              cultural landscapes of Rajasthan and Kerala — I didn&apos;t just
              travel. I lived.
            </p>

            {/* Story paragraph 2 */}
            <p className="font-body text-sm leading-7 text-muted md:text-base md:leading-8">
              Through every conversation and shared meal, a profound truth
              emerged: modern life has severed our connection to original,
              unadulterated nourishment. We are consuming mass-produced noise
              and forgetting the ancient daily rituals that sustain the spirit.
            </p>

            {/* Gold divider */}
            <div className="h-px w-10 bg-gold" />

            {/* Mission paragraph */}
            <p className="font-body text-sm leading-7 text-muted md:text-base md:leading-8">
              The Only Retreats exists as a quiet revolution — a movement to
              restore timeless heritage to the modern home. Anchored by the
              Chakravyuh, our symbol of unassailable trust and sacred alignment,
              we do not mass-produce. We preserve.
            </p>

            {/* Three pillars */}
            <div className="grid grid-cols-3 gap-4 border-t border-b border-border py-4">
              {/* Pillar 1 */}
              <div className="flex flex-col items-center gap-3 px-2 text-center">
                <div className="flex h-8 w-8 items-center justify-center">
                  <Leaf className="size-6 stroke-[1.5] text-gold/70" />
                </div>
                <div className="hidden h-6 w-px self-center bg-border" />
                <p className="font-body text-xs font-medium leading-5 text-foreground">
                  100% Raw
                  <br />
                  Traceability
                </p>
              </div>

              {/* Divider */}
              <div className="flex flex-col items-center gap-3 border-x border-border px-2 text-center">
                <div className="flex h-8 w-8 items-center justify-center">
                  <Hand className="size-6 stroke-[1.5] text-gold/70" />
                </div>
                <p className="font-body text-xs font-medium leading-5 text-foreground">
                  Blessed by Hand,
                  <br />
                  Never Machines
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="flex flex-col items-center gap-3 px-2 text-center">
                <div className="flex h-8 w-8 items-center justify-center">
                  <Mountain className="size-6 stroke-[1.5] text-gold/70" />
                </div>
                <p className="font-body text-xs font-medium leading-5 text-foreground">
                  Grassroots Honor:
                  <br />
                  <span className="text-[0.7rem] font-normal text-muted">
                    ₹5 from every single bottle flows directly back into tribal
                    foundations and local community development.
                  </span>
                </p>
              </div>
            </div>

            {/* Signature */}
            <div className="pt-2">
              <p className="font-display text-xl tracking-[-0.02em] text-foreground">
                {founderContent.name}
              </p>
              <p className="mt-1 text-[0.6rem] uppercase tracking-[0.2em] text-muted">
                Founder &amp; Custodian, The Only Retreats
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
