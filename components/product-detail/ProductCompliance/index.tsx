import type { Product } from "@/lib/content/product";

type Props = {
  product: Product;
};

export function ProductCompliance({ product }: Props) {
  const isGhee =
    product.slug.includes("ghee") ||
    product.slug.includes("badri") ||
    product.name.toLowerCase().includes("ghee");
  if (!isGhee) return null;

  return (
    <section className="border-t border-border bg-background py-12 md:py-16">
      <div className="mx-auto max-w-4xl px-4 md:px-8">
        {/* Header */}
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
            {/* Veg mark + Ingredients */}
            <div className="rounded-xl border border-border p-5">
              <div className="mb-4 flex items-center gap-3">
                {/* Green veg dot */}
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm border-2 border-green-600">
                  <div className="h-2.5 w-2.5 rounded-full bg-green-600" />
                </div>
                <p className="text-xs font-medium tracking-[0.15em] text-foreground uppercase">
                  Vegetarian Product
                </p>
              </div>
              <div>
                <p className="mb-1 text-[0.6rem] tracking-[0.15em] text-muted uppercase">
                  Ingredients
                </p>
                <p className="text-sm text-foreground">
                  Milk fat (made from Badri cow milk)
                </p>
              </div>
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
                Store in a cool, dry place away from direct heat and sunlight,
                lid tightly closed. Seasonal changes may appear in colour &
                flavour. Do not refrigerate.
              </p>
              <div
                className="space-y-1 pt-2"
                style={{ borderTop: "1px solid var(--border)" }}
              >
                <p className="text-[0.6rem] text-muted">
                  Batch No: TOR-PRH-JUN-001-26
                </p>
                <p className="text-[0.6rem] text-muted">
                  Packed on: 08-AUG-2026
                </p>
                <p className="text-[0.6rem] text-muted">
                  Best Before: 08-FEB-2028
                </p>
              </div>
            </div>

            {/* Facility & Contact */}
            <div className="space-y-2 rounded-xl border border-border p-5">
              <p className="mb-2 text-[0.6rem] tracking-[0.15em] text-muted uppercase">
                Manufactured & Contact
              </p>
              <p className="text-xs text-foreground">
                Sourced from Himalayan villages, Kullu Valley, Himachal Pradesh
              </p>
              <p className="text-xs text-muted">
                Packed by: Rugvedic Ventures Pvt. Ltd, Pune
              </p>
              <p className="text-xs text-muted">
                Villages: Pulag, Rumsu, Hallan · Altitude: 2460m
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
              Per serving 14g (1 Tbsp) · 32 servings per pack
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
                  { name: "Energy", per100: "898.4 kcal", rda: "6.29%" },
                  { name: "Protein", per100: "0g", rda: "0%" },
                  { name: "Carbohydrate", per100: "0g", rda: "0%" },
                  { name: "Total Sugar", per100: "0g", rda: "—" },
                  { name: "Added Sugar", per100: "0g", rda: "—" },
                  { name: "Total Fat", per100: "99.8g", rda: "20.8%" },
                  { name: "Saturated Fat", per100: "67.8g", rda: "43.1%" },
                  { name: "Trans Fat", per100: "0g", rda: "—" },
                  { name: "PUFA", per100: "2.9g", rda: "—" },
                  { name: "MUFA", per100: "28.2g", rda: "—" },
                  { name: "Omega 3", per100: "0.36g", rda: "—" },
                  { name: "Omega 6", per100: "2.4g", rda: "—" },
                  { name: "Cholesterol", per100: "128.4mg", rda: "—" },
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
              *%RDA values are based on a 2000 kcal diet. Your daily values may
              be higher or lower depending on your calorie needs.
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
                FSSAI License No. 21526037004345
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
