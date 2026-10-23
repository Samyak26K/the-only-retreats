import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { FooterSection } from "@/components/sections/Footer";
import { prisma } from "@/lib/prisma";
import { sanitizeArticleHtml } from "@/lib/articles/sanitize-article-html";

export const revalidate = 60;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.article.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: {
      title: true,
      seoTitle: true,
      seoDescription: true,
      excerpt: true,
      coverImageUrl: true,
    },
  });
  if (!article) return {};

  const title = article.seoTitle ?? `${article.title} | The Only Retreats`;
  const description = article.seoDescription ?? article.excerpt ?? "";

  return {
    title,
    description,
    openGraph: {
      title: article.seoTitle ?? article.title,
      description,
      images: article.coverImageUrl ? [{ url: article.coverImageUrl }] : [],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await prisma.article.findFirst({
    where: { slug, status: "PUBLISHED" },
  });

  if (!article) notFound();

  const relatedProduct = article.featuredProduct
    ? await prisma.product.findUnique({
        where: { slug: article.featuredProduct },
        select: {
          id: true,
          name: true,
          slug: true,
          shortDescription: true,
          media: { take: 1, select: { url: true } },
          variants: {
            where: { status: "ACTIVE" },
            take: 1,
            select: { sellingPrice: true },
          },
        },
      })
    : null;

  return (
    <>
      <div className="h-(--navbar-height-mobile) md:h-(--navbar-height-tablet) lg:h-(--navbar-height-desktop)" />

      {article.coverImageUrl ? (
        <div className="relative aspect-[21/9] w-full overflow-hidden">
          <Image
            src={article.coverImageUrl}
            alt={article.title}
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)",
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
            {article.category ? (
              <p className="mb-3 text-[0.6rem] uppercase tracking-[0.3em] text-gold">
                {article.category}
              </p>
            ) : null}
            <h1 className="max-w-4xl font-display text-3xl leading-tight tracking-[-0.02em] text-white md:text-5xl lg:text-6xl">
              {article.title}
            </h1>
            {article.publishedAt ? (
              <p className="mt-4 text-xs text-white/60">
                {new Date(article.publishedAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="bg-background">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_320px] lg:gap-16">
            <div>
              <nav className="mb-8 flex items-center gap-2 text-xs uppercase tracking-wide text-muted">
                <Link href="/" className="hover:text-foreground">
                  Home
                </Link>
                <span>/</span>
                <Link href="/articles" className="hover:text-foreground">
                  Articles
                </Link>
                <span>/</span>
                <span className="max-w-[200px] truncate text-foreground">
                  {article.title}
                </span>
              </nav>

              {!article.coverImageUrl ? (
                <>
                  {article.category ? (
                    <p className="mb-4 text-[0.6rem] uppercase tracking-[0.3em] text-gold">
                      {article.category}
                    </p>
                  ) : null}
                  <h1 className="mb-6 font-display text-4xl leading-tight tracking-[-0.03em] text-foreground md:text-5xl">
                    {article.title}
                  </h1>
                  {article.publishedAt ? (
                    <p className="mb-8 text-xs text-muted">
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
                </>
              ) : null}

              {article.excerpt ? (
                <p className="mb-10 border-b border-border pb-10 font-display text-xl italic leading-relaxed text-muted md:text-2xl">
                  {article.excerpt}
                </p>
              ) : null}

              <div
                className="space-y-6
                  [&_h2]:font-display [&_h2]:text-2xl [&_h2]:md:text-3xl
                  [&_h2]:text-foreground [&_h2]:tracking-[-0.02em]
                  [&_h2]:mt-10 [&_h2]:mb-4
                  [&_h3]:font-display [&_h3]:text-xl [&_h3]:text-foreground
                  [&_h3]:tracking-[-0.01em] [&_h3]:mt-8 [&_h3]:mb-3
                  [&_p]:font-body [&_p]:text-base [&_p]:leading-8
                  [&_p]:text-muted [&_p]:mb-0
                  [&_strong]:text-foreground [&_strong]:font-semibold
                  [&_em]:font-display [&_em]:italic [&_em]:text-foreground/80
                  [&_ul]:space-y-3 [&_ul]:my-4
                  [&_li]:text-muted [&_li]:leading-7 [&_li]:pl-2
                  [&_li]:before:content-['+'] [&_li]:before:text-gold
                  [&_li]:before:mr-3 [&_li]:before:font-bold
                  [&_li]:list-none
                  [&_a]:text-gold [&_a]:no-underline
                  hover:[&_a]:underline [&_a]:underline-offset-2
                  [&_blockquote]:border-l-2 [&_blockquote]:border-gold
                  [&_blockquote]:pl-6 [&_blockquote]:my-8
                  [&_blockquote]:font-display [&_blockquote]:italic
                  [&_blockquote]:text-xl [&_blockquote]:text-muted
                  [&_img]:rounded-2xl [&_img]:w-full [&_img]:my-8"
                dangerouslySetInnerHTML={{
                  __html: sanitizeArticleHtml(article.content),
                }}
              />

              <div className="mt-16 border-t border-border pt-8">
                <Link
                  href="/articles"
                  className="text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:text-foreground"
                >
                  ← All Articles
                </Link>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-8 lg:sticky lg:top-28">
                {relatedProduct ? (
                  <div className="rounded-2xl border border-border p-5">
                    <p className="mb-4 text-[0.55rem] uppercase tracking-[0.24em] text-gold">
                      Featured Product
                    </p>
                    <Link
                      href={`/products/${relatedProduct.slug}`}
                      className="group block"
                    >
                      <div className="relative mb-4 aspect-square overflow-hidden rounded-xl bg-surface">
                        {relatedProduct.media[0]?.url ? (
                          <Image
                            src={relatedProduct.media[0].url}
                            alt={relatedProduct.name}
                            fill
                            className="object-contain transition-transform duration-500 group-hover:scale-105"
                            sizes="280px"
                          />
                        ) : null}
                      </div>
                      <h2 className="mb-2 font-display text-lg leading-tight text-foreground transition-colors group-hover:text-forest">
                        {relatedProduct.name}
                      </h2>
                      {relatedProduct.shortDescription ? (
                        <p className="mb-3 line-clamp-3 text-xs leading-5 text-muted">
                          {relatedProduct.shortDescription}
                        </p>
                      ) : null}
                      {relatedProduct.variants[0]?.sellingPrice ? (
                        <p className="mb-4 font-heading text-base text-gold">
                          ₹
                          {Number(
                            relatedProduct.variants[0].sellingPrice,
                          ).toLocaleString("en-IN")}
                        </p>
                      ) : null}
                      <span className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border px-4 py-2 text-xs uppercase tracking-[0.2em] text-foreground transition-colors group-hover:border-gold group-hover:text-gold">
                        Shop Now →
                      </span>
                    </Link>
                  </div>
                ) : null}

                <div className="space-y-4 rounded-2xl border border-border p-5">
                  <p className="text-[0.55rem] uppercase tracking-[0.24em] text-muted">
                    About this article
                  </p>
                  {article.category ? (
                    <div>
                      <p className="mb-1 text-[0.6rem] uppercase tracking-wide text-muted/60">
                        Category
                      </p>
                      <p className="text-sm text-foreground">
                        {article.category}
                      </p>
                    </div>
                  ) : null}
                  {article.publishedAt ? (
                    <div>
                      <p className="mb-1 text-[0.6rem] uppercase tracking-wide text-muted/60">
                        Published
                      </p>
                      <p className="text-sm text-foreground">
                        {new Date(article.publishedAt).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          },
                        )}
                      </p>
                    </div>
                  ) : null}
                  <div>
                    <p className="mb-1 text-[0.6rem] uppercase tracking-wide text-muted/60">
                      Brand
                    </p>
                    <p className="text-sm text-foreground">The Only Retreats</p>
                  </div>
                </div>

                <div className="rounded-2xl bg-forest p-6 text-center">
                  <p className="mb-2 font-display text-xl text-white">
                    Explore Our Collection
                  </p>
                  <p className="mb-4 text-xs leading-5 text-white/70">
                    Not mass produced. Only preserved.
                  </p>
                  <Link
                    href="/products"
                    className="inline-flex w-full items-center justify-center rounded-full bg-white px-4 py-3 text-xs font-medium uppercase tracking-[0.2em] text-forest transition-colors hover:bg-white/90"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FooterSection />
    </>
  );
}
