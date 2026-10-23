import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { AdminAccessRequired } from "@/components/admin/AdminAccessRequired";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/Heading";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/server/auth";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default async function NewArticlePage() {
  const adminContext = await requirePermission("content.write").catch(
    () => null,
  );
  if (!adminContext) return <AdminAccessRequired />;

  async function createArticleAction(formData: FormData) {
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

    const article = await prisma.article.create({
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
        publishedAt: status === "PUBLISHED" ? new Date() : null,
      },
    });

    revalidatePath("/articles");
    if (status === "PUBLISHED") revalidatePath(`/articles/${article.slug}`);
    redirect(`/admin/articles/${article.id}`);
  }

  const products = await prisma.product.findMany({
    where: { status: "ACTIVE" },
    select: { id: true, name: true, slug: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-3xl space-y-6">
      <Heading
        title="New Article"
        subtitle="Write and publish a new article."
        alignment="left"
      />

      <form action={createArticleAction} className="space-y-6">
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
              placeholder="Enter article title..."
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="article-slug"
              className="text-xs uppercase tracking-wide text-muted"
            >
              Slug (auto-generated if empty)
            </label>
            <input
              id="article-slug"
              type="text"
              name="slug"
              placeholder="article-url-slug"
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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
              placeholder="Short summary shown in listings..."
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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
              rows={16}
              placeholder="Write your article here..."
              className="w-full rounded-lg border border-border bg-background px-4 py-3 font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="text-xs text-muted">
              Supports basic HTML tags such as paragraphs, headings, emphasis,
              and lists.
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
              placeholder="https://res.cloudinary.com/..."
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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
              placeholder="e.g. Himalayan Life, Ayurveda, Recipes..."
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="article-featured-product"
              className="text-xs uppercase tracking-wide text-muted"
            >
              Featured Product (optional)
            </label>
            <select
              id="article-featured-product"
              name="featuredProduct"
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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
              defaultValue="DRAFT"
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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
              placeholder="SEO optimized title..."
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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
              placeholder="SEO meta description..."
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit">Create Article</Button>
          <Button variant="outline" render={<Link href="/admin/articles" />}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
