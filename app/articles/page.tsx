import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { FooterSection } from "@/components/sections/Footer";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Articles | The Only Retreats",
  description:
    "Stories from the Himalayas — Ayurveda, heritage, recipes and valley life.",
};

export const revalidate = 60;

export default async function ArticlesPage() {
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
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

  return (
    <>
      <div className="h-(--navbar-height-mobile) md:h-(--navbar-height-tablet) lg:h-(--navbar-height-desktop)" />
      <Container className="py-16 md:py-24">
        <div className="mb-12">
          <p className="mb-3 text-[0.6rem] uppercase tracking-[0.24em] text-gold">
            From Our Journal
          </p>
          <h1 className="font-display text-4xl tracking-[-0.03em] text-foreground md:text-5xl">
            Articles
          </h1>
          <p className="mt-3 max-w-lg text-sm text-muted">
            Stories from the Himalayas — Ayurveda, heritage, recipes and valley
            life.
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm text-muted">No articles published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className="group block"
              >
                <div className="relative mb-4 aspect-[16/9] overflow-hidden rounded-2xl bg-surface">
                  {article.coverImageUrl ? (
                    <Image
                      src={article.coverImageUrl}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-surface">
                      <p className="font-display text-4xl text-muted/20">✦</p>
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
                  <h2 className="font-display text-xl leading-tight text-foreground transition-colors group-hover:text-forest">
                    {article.title}
                  </h2>
                  {article.excerpt ? (
                    <p className="line-clamp-2 text-sm leading-6 text-muted">
                      {article.excerpt}
                    </p>
                  ) : null}
                  {article.publishedAt ? (
                    <p className="text-xs text-muted/60">
                      {new Date(article.publishedAt).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        },
                      )}
                    </p>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        )}
      </Container>
      <FooterSection />
    </>
  );
}
