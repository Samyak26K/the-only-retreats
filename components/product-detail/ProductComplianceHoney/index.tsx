import type { Product } from "@/lib/content/product";

type Props = {
  product: Product;
};

export function ProductComplianceHoney({ product }: Props) {
  const isHoney = product.slug.includes("honey");
  if (!isHoney) return null;

  return (
    <section className="border-t border-border bg-background py-12 md:py-16">
      <div className="mx-auto max-w-4xl px-4 md:px-8">
        <div className="mb-8">
          <p className="mb-2 text-[0.6rem] tracking-[0.24em] text-muted uppercase">
            Product Information
          </p>
          <h2 className="font-display text-2xl text-foreground">
            Label & Compliance Details
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Left column */}
          <div className="space-y-6">
            {/* Ingredients */}
            <div className="rounded-xl border border-border p-5">
              <p className="mb-2 text-[0.6rem] tracking-[0.15em] text-muted uppercase">
                Ingredients
              </p>
              <p className="text-sm text-foreground">
                Pure Natural Himalayan Honey
              </p>
              <p className="mt-2 text-[0.6rem] leading-5 text-muted">
                Naturally contains microscopic amounts of Fe, Zn, K, Mg, Ca and
                B Vitamin
              </p>
            </div>

            {/* Warning */}
            <div className="rounded-xl border border-red-100 bg-red-50/50 p-5">
              <p className="mb-2 text-[0.6rem] font-semibold tracking-[0.15em] text-red-600 uppercase">
                ⚠ Important Warning
              </p>
              <p className="text-sm font-medium text-red-700">
                Do not feed to infants under one year of age.
              </p>
            </div>

            {/* Shelf life & storage */}
            <div className="space-y-3 rounded-xl border border-border p-5">
              <p className="text-[0.6rem] tracking-[0.15em] text-muted uppercase">
                Shelf Life & Storage
              </p>
              <p className="text-sm text-foreground">
                Best before 18 months from date of packaging
              </p>
              <p className="text-xs leading-5 text-muted">
                Store at room temperature in a dry place. Keep away from direct
                sunlight. Crystallization is a natural process of pure honey —
                it does not mean it has gone bad. Do not refrigerate.
              </p>
              <div
                className="space-y-1 pt-2"
                style={{ borderTop: "1px solid var(--border)" }}
              >
                <p className="text-[0.6rem] text-muted">
                  Batch No: TOR-KJ-HJUN-001-26
                </p>
                <p className="text-[0.6rem] text-muted">
                  Packed on: 08-AUG-2026
                </p>
                <p className="text-[0.6rem] text-muted">
                  Use Before: 08-FEB-2028
                </p>
              </div>
            </div>

            {/* Facility & Contact */}
            <div className="space-y-2 rounded-xl border border-border p-5">
              <p className="mb-2 text-[0.6rem] tracking-[0.15em] text-muted uppercase">
                Source & Contact
              </p>
              <p className="text-xs text-foreground">
                Sourced from Deendayal Bee Farm, VPO Kararsu Village, Kullu,
                Himachal Pradesh
              </p>
              <p className="text-xs text-muted">
                Villages: Kararsu, Jana · Altitude: 2200m (7260ft)
              </p>
              <p className="text-xs text-muted">
                Packed & Marketed by: Rugvedic Ventures Pvt. Ltd, GAT 458,
                Highland Spaces, Pune 412105
              </p>
              <div
                className="space-y-1 pt-2"
                style={{ borderTop: "1px solid var(--border)" }}
              >
                <p className="text-[0.6rem] text-muted">
                  📧 customer@theonlyretreats.com
                </p>
                <p className="text-[0.6rem] text-muted">📞 +91 9225181202</p>
              </div>
            </div>
          </div>

          {/* Right column: Nutrition table */}
          <div className="rounded-xl border border-border p-5">
            <p className="mb-1 text-[0.6rem] tracking-[0.15em] text-muted uppercase">
              Nutrition Facts
            </p>
            <p className="mb-4 text-[0.55rem] text-muted">
              Per serving 21g (1 Tbsp) · 35 servings per pack
            </p>

            <table className="w-full text-xs">
              <thead>
                <tr style={{ borderBottom: "2px solid var(--border)" }}>
                  <th className="py-2 text-left text-[0.6rem] font-medium tracking-wide text-muted uppercase">
                    Nutrient
                  </th>
                  <th className="py-2 text-right text-[0.6rem] font-medium tracking-wide text-muted uppercase">
                    Per 100g
                  </th>
                  <th className="py-2 text-right text-[0.6rem] font-medium tracking-wide text-muted uppercase">
                    %RDA
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Energy", per100: "313 kcal", rda: "3.28%" },
                  { name: "Protein", per100: "0.60g", rda: "<0.1%" },
                  { name: "Carbohydrate", per100: "81.8g", rda: "5.8%" },
                  {
                    name: "Total Natural Sugar",
                    per100: "82.4g",
                    rda: "—",
                  },
                  { name: "Added Sugar", per100: "0g", rda: "—" },
                  { name: "Sodium", per100: "6.70mg", rda: "0.07%" },
                ].map((row, i) => (
                  <tr
                    key={row.name}
                    style={{
                      borderBottom: "1px solid var(--border)",
                      backgroundColor:
                        i % 2 === 0 ? "transparent" : "var(--surface)",
                    }}
                  >
                    <td className="py-2 text-foreground">{row.name}</td>
                    <td className="py-2 text-right text-muted">{row.per100}</td>
                    <td className="py-2 text-right text-muted">{row.rda}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="mt-3 text-[0.55rem] leading-4 text-muted">
              *%RDA values are based on a 2000 kcal diet.
            </p>

            {/* FSSAI */}
            <div
              className="mt-4 flex items-center gap-3 pt-4"
              style={{ borderTop: "1px solid var(--border)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://res.cloudinary.com/k7cipxug/image/upload/v1787843837/FSSAI-License-Mandatory-for-Small-Business-300x232-removebg-preview.png"
                alt="FSSAI Licensed"
                className="h-8 w-auto object-contain opacity-70"
              />
              <p className="text-[0.55rem] text-muted">
                FSSAI License No. 10924006000044
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
