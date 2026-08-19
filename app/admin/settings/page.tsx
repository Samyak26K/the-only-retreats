import { Heading } from "@/components/ui/Heading";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/server/auth";

export default async function AdminSettingsPage() {
  const adminContext = await requirePermission("support.read").catch(
    () => null,
  );

  if (!adminContext) {
    return null;
  }

  let settings: Array<{
    id: string;
    key: string;
    isConfigured: boolean;
    updatedAt: Date;
  }> = [];
  let error: string | null = null;

  try {
    const rows = await prisma.siteSetting.findMany({
      orderBy: { key: "asc" },
      select: {
        id: true,
        key: true,
        value: true,
        updatedAt: true,
      },
    });

    settings = rows.map((setting) => ({
      id: setting.id,
      key: setting.key,
      isConfigured: Boolean(setting.value?.trim()),
      updatedAt: setting.updatedAt,
    }));
  } catch {
    error = "Unable to load operational settings right now.";
  }

  return (
    <div className="space-y-6">
      <Heading
        title="Settings"
        subtitle="Operational setting records are visible here without exposing stored values or credentials."
        alignment="left"
      />
      {error ? (
        <div className="rounded-2xl border border-dashed border-border bg-background p-6 text-sm text-muted">
          {error}
        </div>
      ) : null}
      <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
        {settings.length === 0 ? (
          <div className="p-8 text-sm text-muted">
            No operational settings have been recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border text-sm">
              <thead className="bg-muted/20 text-left text-xs uppercase tracking-[0.24em] text-muted">
                <tr>
                  <th className="px-4 py-3">Setting</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Last updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-background">
                {settings.map((setting) => (
                  <tr key={setting.id}>
                    <td className="px-4 py-4 font-medium text-foreground">
                      {setting.key}
                    </td>
                    <td className="px-4 py-4 text-muted">
                      {setting.isConfigured ? "Configured" : "Not configured"}
                    </td>
                    <td className="px-4 py-4 text-muted">
                      {new Date(setting.updatedAt).toLocaleDateString("en-IN")}
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
