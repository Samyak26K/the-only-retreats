import Link from "next/link";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";

import { AdminAccessRequired } from "@/components/admin/AdminAccessRequired";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/Heading";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/server/auth";

type Props = {
  params: Promise<{ id: string }>;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default async function EditArticlePage({ params }: Props) {
  const adminContext = await requirePermission("content.write").catch(
    () => null,
  );
  if (!adminContext) return <AdminAccessRequired />;

  const { id } = await params;
  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) notFound();

  const products = await prisma.product.findMany({
    where: { status: "ACTIVE" },
    select: { id: true, name: true, slug: true },
    orderBy: { name: "asc" },
  });

  async function updateArticleAction(formData: FormData) {
    "use server";

    await requirePermission("content.write");

    const title = formData.get("title");
    const content = formData.get("content");
    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof content !== "string" ||
      !content.trim()
    ) {
      throw new Error("Article title and content are required");
    }

    const requestedSlug = formData.get("slug");
    const slug =
      typeof requestedSlug === "string" && requestedSlug.trim()
        ? slugify(requestedSlug)
        : slugify(title);
    if (!slug) throw new Error("Article slug is required");

    const statusValue = formData.get("status");
    const status = statusValue === "PUBLISHED" ? "PUBLISHED" : "DRAFT";
    const optionalValue = (key: string) => {
      const value = formData.get(key);
      return typeof value === "string" && value.trim() ? value.trim() : null;
    };

    const existing = await prisma.article.findUnique({ where: { id } });
    if (!existing) notFound();

    const updatedArticle = await prisma.article.update({
      where: { id },
      data: {
        title: title.trim(),
        slug,
        excerpt: optionalValue("excerpt"),
        content,
        coverImageUrl: optionalValue("coverImageUrl"),
        category: optionalValue("category"),
        status,
        featuredProduct: optionalValue("featuredProduct"),
        seoTitle: optionalValue("seoTitle"),
        seoDescription: optionalValue("seoDescription"),
        publishedAt:
          status === "PUBLISHED" ? (existing.publishedAt ?? new Date()) : null,
      },
    });

    revalidatePath("/articles");
    revalidatePath(`/articles/${existing.slug}`);
    revalidatePath(`/articles/${updatedArticle.slug}`);
    redirect("/admin/articles");
  }

  const inputClassName =
    "w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Heading
          title="Edit Article"
          subtitle={article.title}
          alignment="left"
        />
        {article.status === "PUBLISHED" ? (
          <Link
            href={`/articles/${article.slug}`}
            target="_blank"
            className="text-xs text-muted underline underline-offset-2 hover:text-foreground"
          >
            View live →
          </Link>
        ) : null}
      </div>

      <form action={updateArticleAction} className="space-y-6">
        <div className="space-y-5 rounded-2xl border border-border bg-background p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">
            Content
          </h3>
          <div className="space-y-2">
            <label
              htmlFor="article-title"
              className="text-xs uppercase tracking-wide text-muted"
            >
              Title *
            </label>
            <input
              id="article-title"
              type="text"
              name="title"
              required
              defaultValue={article.title}
              className={inputClassName}
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="article-slug"
              className="text-xs uppercase tracking-wide text-muted"
            >
              Slug
            </label>
            <input
              id="article-slug"
              type="text"
              name="slug"
              defaultValue={article.slug}
              className={inputClassName}
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="article-excerpt"
              className="text-xs uppercase tracking-wide text-muted"
            >
              Excerpt
            </label>
            <textarea
              id="article-excerpt"
              name="excerpt"
              rows={2}
              defaultValue={article.excerpt ?? ""}
              className={inputClassName}
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="article-content"
              className="text-xs uppercase tracking-wide text-muted"
            >
              Content *
            </label>
            <textarea
              id="article-content"
              name="content"
              required
              rows={20}
              defaultValue={article.content}
              className={`${inputClassName} font-mono`}
            />
            <p className="text-xs text-muted">
              Supports HTML paragraphs, headings, emphasis, links, and lists.
            </p>
          </div>
        </div>

        <div className="space-y-5 rounded-2xl border border-border bg-background p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">
            Media &amp; Category
          </h3>
          <div className="space-y-2">
            <label
              htmlFor="article-cover-image"
              className="text-xs uppercase tracking-wide text-muted"
            >
              Cover Image URL
            </label>
            <input
              id="article-cover-image"
              type="url"
              name="coverImageUrl"
              defaultValue={article.coverImageUrl ?? ""}
              placeholder="https://res.cloudinary.com/..."
              className={inputClassName}
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="article-category"
              className="text-xs uppercase tracking-wide text-muted"
            >
              Category
            </label>
            <input
              id="article-category"
              type="text"
              name="category"
              defaultValue={article.category ?? ""}
              placeholder="e.g. Himalayan Life, Ayurveda, Recipes..."
              className={inputClassName}
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="article-featured-product"
              className="text-xs uppercase tracking-wide text-muted"
            >
              Featured Product
            </label>
            <select
              id="article-featured-product"
              name="featuredProduct"
              defaultValue={article.featuredProduct ?? ""}
              className={inputClassName}
            >
              <option value="">No featured product</option>
              {products.map((product) => (
                <option key={product.id} value={product.slug}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-5 rounded-2xl border border-border bg-background p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">
            Publishing
          </h3>
          <div className="space-y-2">
            <label
              htmlFor="article-status"
              className="text-xs uppercase tracking-wide text-muted"
            >
              Status
            </label>
            <select
              id="article-status"
              name="status"
              defaultValue={article.status}
              className={inputClassName}
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>
        </div>

        <div className="space-y-5 rounded-2xl border border-border bg-background p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">
            SEO
          </h3>
          <div className="space-y-2">
            <label
              htmlFor="article-seo-title"
              className="text-xs uppercase tracking-wide text-muted"
            >
              SEO Title
            </label>
            <input
              id="article-seo-title"
              type="text"
              name="seoTitle"
              defaultValue={article.seoTitle ?? ""}
              className={inputClassName}
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="article-seo-description"
              className="text-xs uppercase tracking-wide text-muted"
            >
              SEO Description
            </label>
            <textarea
              id="article-seo-description"
              name="seoDescription"
              rows={2}
              defaultValue={article.seoDescription ?? ""}
              className={inputClassName}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit">Save Changes</Button>
          <Button variant="outline" render={<Link href="/admin/articles" />}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
