import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { AdminAccessRequired } from "@/components/admin/AdminAccessRequired";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/Heading";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/server/auth";

export default async function AdminArticlesPage() {
  const adminContext = await requirePermission("content.read").catch(
    () => null,
  );
  if (!adminContext) return <AdminAccessRequired />;

  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      category: true,
      publishedAt: true,
      createdAt: true,
    },
  });

  async function deleteArticleAction(formData: FormData) {
    "use server";

    await requirePermission("content.write");
    const id = formData.get("id");
    if (typeof id !== "string" || !id) return;

    const article = await prisma.article.delete({ where: { id } });
    revalidatePath("/articles");
    revalidatePath(`/articles/${article.slug}`);
    redirect("/admin/articles");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <Heading
          title="Articles"
          subtitle="Manage blog posts and editorial content."
          alignment="left"
        />
        <Button render={<Link href="/admin/articles/new" />}>
          New Article
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
        <div className="border-b border-border p-4">
          <p className="text-sm text-muted">
            {articles.length} article{articles.length !== 1 ? "s" : ""}
          </p>
        </div>
        {articles.length === 0 ? (
          <div className="p-8 text-sm text-muted">No articles yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border text-sm">
              <thead className="bg-muted/20 text-left text-xs uppercase tracking-[0.24em] text-muted">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Published</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-background">
                {articles.map((article) => (
                  <tr key={article.id} className="align-top">
                    <td className="px-4 py-4">
                      <p className="font-medium text-foreground">
                        {article.title}
                      </p>
                      <p className="mt-1 text-xs text-muted">{article.slug}</p>
                    </td>
                    <td className="px-4 py-4 text-muted">
                      {article.category ?? "—"}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          article.status === "PUBLISHED"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {article.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs text-muted">
                      {article.publishedAt
                        ? new Date(article.publishedAt).toLocaleDateString(
                            "en-IN",
                          )
                        : "—"}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/admin/articles/${article.id}`}
                          className="text-xs text-foreground hover:underline"
                        >
                          Edit
                        </Link>
                        {article.status === "PUBLISHED" ? (
                          <Link
                            href={`/articles/${article.slug}`}
                            target="_blank"
                            className="text-xs text-muted hover:underline"
                          >
                            View
                          </Link>
                        ) : null}
                        <form action={deleteArticleAction}>
                          <input type="hidden" name="id" value={article.id} />
                          <button
                            type="submit"
                            className="text-xs text-red-500 hover:underline"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
