import { Container } from "@/components/ui/Container";
import type { Product } from "@/lib/content/product";

type Props = {
  product: Product;
};

export function ProductInfoGrid({ product }: Props) {
  const passport = product.productPassport;
  const taste = product.tasteProfile;
  const nutrition = product.nutrition;

  const passportRows = [
    { key: "Origin", value: passport.region },
    { key: "Altitude", value: passport.altitude },
    { key: "Season", value: passport.harvestSeason },
    { key: "Community", value: passport.community },
    { key: "Processing", value: "Raw & Unheated" },
    { key: "Traceability", value: passport.traceabilityCode },
  ].filter((row): row is { key: string; value: string } => Boolean(row.value));

  return (
    <section
      className="border-t border-border py-12 md:py-16"
      style={{ backgroundColor: "#f2ede3" }}
    >
      <Container>
        <div className="grid grid-cols-1 divide-y divide-border/50 md:grid-cols-5 md:divide-x md:divide-y-0">
          <div className="space-y-4 py-6 md:px-6 md:py-0 md:first:pl-0">
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-foreground">
              Taste Profile
            </p>
            <div className="space-y-2.5">
              {taste.attributes.length > 0 ? (
                taste.attributes.map((attr) => (
                  <div
                    key={attr.label}
                    className="flex items-center justify-between"
                  >
                    <span className="text-xs text-muted">{attr.label}</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((dot) => (
                        <span
                          key={dot}
                          className={`h-2 w-2 rounded-full border ${
                            dot <= attr.intensity
                              ? "border-foreground bg-foreground"
                              : "border-border bg-transparent"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted">
                  {taste.summary || "Tasting notes coming soon."}
                </p>
              )}
              {taste.summary && taste.attributes.length > 0 ? (
                <p className="mt-2 text-xs text-muted/60 italic">
                  {taste.summary}
                </p>
              ) : null}
            </div>
          </div>

          <div className="space-y-4 py-6 md:px-6 md:py-0">
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-foreground">
              Nutrition (Per 100g)
            </p>
            <div className="space-y-1.5">
              {nutrition.facts.length > 0 ? (
                nutrition.facts.map((fact) => (
                  <div key={fact.label} className="flex justify-between">
                    <span className="text-xs text-muted">{fact.label}</span>
                    <span className="text-xs font-medium text-foreground">
                      {fact.value}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted">
                  Nutritional info coming soon.
                </p>
              )}
              {nutrition.servingSize ? (
                <p className="mt-2 border-t border-border/50 pt-2 text-[0.6rem] text-muted/50">
                  Per {nutrition.servingSize}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col items-start space-y-4 py-6 md:px-6 md:py-0">
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-foreground">
              Ingredients
            </p>
            <div className="flex w-full flex-1 flex-col items-center justify-center space-y-4 text-center">
              <p className="text-sm leading-snug font-medium text-foreground">
                100% Pure {product.name}.
                <br />
                <span className="font-normal text-muted">Nothing Else.</span>
              </p>
              <div className="text-3xl opacity-20">✿</div>
            </div>
          </div>

          <div className="space-y-4 py-6 md:px-6 md:py-0">
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-foreground">
              Product Passport
            </p>
            <div className="space-y-1.5">
              {passportRows.map((row) => (
                <div key={row.key} className="flex justify-between gap-2">
                  <span className="shrink-0 text-xs text-muted">{row.key}</span>
                  <span className="text-right text-xs font-medium text-foreground">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 py-6 md:px-6 md:py-0 md:last:pr-0">
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-foreground">
              Certifications
            </p>
            <div className="space-y-2.5">
              {product.certifications.length > 0 ? (
                product.certifications.map((cert) => (
                  <div key={cert.id} className="flex items-center gap-2">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border">
                      <span className="text-[0.5rem] text-muted">✦</span>
                    </div>
                    <span className="text-xs text-muted">{cert.title}</span>
                  </div>
                ))
              ) : (
                <div className="space-y-2">
                  {[
                    "FSSAI Certified",
                    "Lab Tested",
                    "Raw & Unheated",
                    "No Additives",
                    "Single Origin",
                  ].map((cert) => (
                    <div key={cert} className="flex items-center gap-2">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border">
                        <span className="text-[0.5rem] text-muted">✦</span>
                      </div>
                      <span className="text-xs text-muted">{cert}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
