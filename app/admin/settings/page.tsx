import { Heading } from "@/components/ui/Heading";
import { requirePermission } from "@/lib/server/auth";

export default async function AdminSettingsPage() {
  const adminContext = await requirePermission("support.read").catch(
    () => null,
  );

  if (!adminContext) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Heading
        title="Settings"
        subtitle="System configuration and operational preferences will be surfaced here as the admin surface expands."
        alignment="left"
      />
      <div className="rounded-2xl border border-border bg-background p-6 shadow-sm text-sm text-muted">
        Settings will be implemented as the admin foundation grows. Sensitive
        values such as database credentials and payment secrets remain out of
        the UI.
      </div>
    </div>
  );
}
