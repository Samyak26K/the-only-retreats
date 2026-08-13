import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/Heading";
import { requirePermission } from "@/lib/server/auth";
import { listOrigins } from "@/lib/services/origins";

export default async function AdminOriginsPage() {
  const adminContext = await requirePermission("origins.read").catch(
    () => null,
  );

  if (!adminContext) {
    return null;
  }

  let origins: Awaited<ReturnType<typeof listOrigins>> = [];
  let error: string | null = null;

  try {
    origins = await listOrigins();
  } catch {
    error = "Unable to load origins right now.";
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <Heading
          title="Origins"
          subtitle="Maintain the heritage origin records that underpin the product narrative."
          alignment="left"
        />
        <Link href="/admin/origins/new">
          <Button>Create origin</Button>
        </Link>
      </div>
      {error ? (
        <div className="rounded-2xl border border-dashed border-border bg-background p-6 text-sm text-muted">
          {error}
        </div>
      ) : null}
      <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
        {origins.length === 0 ? (
          <div className="p-8 text-sm text-muted">
            No origins are available yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border text-sm">
              <thead className="bg-muted/20 text-left text-xs uppercase tracking-[0.24em] text-muted">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Verification</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-background">
                {origins.map((origin) => (
                  <tr key={origin.id}>
                    <td className="px-4 py-4">
                      <p className="font-medium text-foreground">
                        {origin.name}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        {origin.regionId}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-muted">
                      {origin.verificationStatus}
                    </td>
                    <td className="px-4 py-4 text-muted">
                      {origin.isActive ? "Active" : "Inactive"}
                    </td>
                    <td className="px-4 py-4">
                      <Link href={`/admin/origins/${origin.id}`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
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
