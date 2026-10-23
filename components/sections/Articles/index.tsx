import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { prisma } from "@/lib/prisma";

export async function ArticlesSection() {
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    take: 3,
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImageUrl: true,
      category: true,
      publishedAt: true,
    },
  });

  if (articles.length === 0) return null;

  return (
    <section className="bg-background py-16 md:py-24">
      <Container>
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="mb-2 text-[0.6rem] uppercase tracking-[0.24em] text-gold">
              From Our Journal
            </p>
            <h2 className="font-display text-4xl tracking-[-0.03em] text-foreground md:text-5xl">
              Stories &amp; Wisdom
            </h2>
            <p className="mt-2 font-display italic text-muted">
              From the mountains, for the home.
            </p>
          </div>
          <Link
            href="/articles"
            className="hidden border-b border-border pb-0.5 text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:text-foreground md:block"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              className="group block"
            >
              <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-2xl bg-surface">
                {article.coverImageUrl ? (
                  <Image
                    src={article.coverImageUrl}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(min-width: 768px) 33vw, 100vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-surface">
                    <p className="font-display text-5xl text-muted/20">✦</p>
                  </div>
                )}
                {article.category ? (
                  <div className="absolute left-3 top-3">
                    <span className="rounded-full bg-background/90 px-2.5 py-1 text-[0.55rem] uppercase tracking-[0.2em] text-foreground">
                      {article.category}
                    </span>
                  </div>
                ) : null}
              </div>

              <div className="space-y-2">
                {article.publishedAt ? (
                  <p className="text-[0.6rem] uppercase tracking-[0.15em] text-muted/60">
                    {new Date(article.publishedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                ) : null}
                <h3 className="font-display text-xl leading-tight text-foreground transition-colors group-hover:text-forest">
                  {article.title}
                </h3>
                {article.excerpt ? (
                  <p className="line-clamp-2 text-sm leading-6 text-muted">
                    {article.excerpt}
                  </p>
                ) : null}
                <p className="text-xs uppercase tracking-[0.15em] text-gold transition-colors group-hover:text-forest">
                  Read more →
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/articles"
            className="border-b border-border pb-1 text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:text-foreground"
          >
            View All Articles
          </Link>
        </div>
      </Container>
    </section>
  );
}
