import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { getReviewMetrics, type Product } from "@/lib/content/product";
import { cn } from "@/lib/utils";

type ProductReviewsProps = {
  reviews: Product["reviews"];
};

function RatingMarks({ rating, label }: { rating: number; label: string }) {
  return (
    <div
      role="img"
      aria-label={`${label}: ${rating} out of 5`}
      className="flex items-center gap-1"
    >
      {Array.from({ length: 5 }, (_, index) => (
        <span
          key={index}
          aria-hidden="true"
          className={cn(
            "size-1 rounded-full",
            index < rating ? "bg-gold" : "bg-border",
          )}
        />
      ))}
    </div>
  );
}

export function ProductReviews({ reviews }: ProductReviewsProps) {
  if (reviews.length === 0) {
    return null;
  }

  const { averageRating, totalReviews } = getReviewMetrics(reviews);
  const averageDisplay = averageRating.toFixed(1);

  return (
    <Section aria-labelledby="product-reviews-title" background="surface">
      <Container>
        <Heading
          eyebrow="Reviews"
          title={<span id="product-reviews-title">Voices from home</span>}
          className="mb-8 max-w-3xl md:mb-10"
        />

        <p className="mb-12 text-sm tracking-[0.08em] text-muted md:mb-16">
          <span className="font-heading text-2xl tracking-normal text-foreground">
            {averageDisplay}
          </span>
          <span className="mx-3 text-border" aria-hidden="true">
            /
          </span>
          <span>5</span>
          <span className="mx-3 text-border" aria-hidden="true">
            ·
          </span>
          <span>
            {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
          </span>
        </p>

        <ul className="grid gap-0 border-t border-border md:grid-cols-2">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="border-b border-border py-10 motion-safe:animate-[hero-rise_600ms_ease-out_both] motion-safe:[animation-range:entry_10%_cover_30%] motion-safe:[animation-timeline:view()] md:border-r md:px-10 md:odd:pl-0 md:even:border-r-0 md:even:pr-0"
            >
              <article>
                <header className="space-y-3">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="font-heading text-lg text-foreground">
                      {review.name}
                    </h3>
                    <p className="text-xs uppercase tracking-[0.18em] text-muted">
                      {review.location}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <RatingMarks
                      rating={review.rating}
                      label={`Rating from ${review.name}`}
                    />
                    {review.verifiedPurchase ? (
                      <p className="text-xs uppercase tracking-[0.18em] text-muted">
                        Verified purchase
                      </p>
                    ) : null}
                  </div>
                </header>

                <p className="mt-5 max-w-xl text-sm leading-7 text-muted md:text-base md:leading-8">
                  {review.review}
                </p>
              </article>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
