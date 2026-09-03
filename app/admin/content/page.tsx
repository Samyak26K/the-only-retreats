import { AdminAccessRequired } from "@/components/admin/AdminAccessRequired";
import { Heading } from "@/components/ui/Heading";
import { requirePermission } from "@/lib/server/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminContentPage() {
  const adminContext = await requirePermission("content.read").catch(
    () => null,
  );

  if (!adminContext) {
    return <AdminAccessRequired />;
  }

  let entries: Awaited<ReturnType<typeof prisma.contentEntry.findMany>> = [];
  let error: string | null = null;

  try {
    entries = await prisma.contentEntry.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    });
  } catch {
    error = "Unable to load content entries right now.";
  }

  return (
    <div className="space-y-6">
      <Heading
        title="Content"
        subtitle="Editorial content management remains separate from the public storefront for now."
        alignment="left"
      />
      {error ? (
        <div className="rounded-2xl border border-dashed border-border bg-background p-6 text-sm text-muted">
          {error}
        </div>
      ) : null}
      <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
        {entries.length === 0 ? (
          <div className="p-8 text-sm text-muted">
            No content entries are available yet.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {entries.map((entry) => (
              <div key={entry.id} className="p-4">
                <p className="font-medium text-foreground">{entry.title}</p>
                <p className="mt-1 text-sm text-muted">{entry.slug}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
