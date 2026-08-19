import { notFound } from "next/navigation";

import { Heading } from "@/components/ui/Heading";
import { requirePermission } from "@/lib/server/auth";
import { getOrigin, updateOrigin } from "@/lib/services/origins";
import { originUpdateSchema } from "@/lib/validation/service-schemas";

export default async function AdminOriginDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const adminContext = await requirePermission("origins.read").catch(
    () => null,
  );

  if (!adminContext) {
    return null;
  }

  const origin = await getOrigin(id);

  if (!origin) {
    notFound();
  }

  async function updateOriginAction(formData: FormData) {
    "use server";

    const writeAdminContext = await requirePermission("origins.write");

    const raw = {
      name: formData.get("name"),
      regionId: formData.get("regionId"),
      villageId: formData.get("villageId"),
      altitude: formData.get("altitude"),
      landscape: formData.get("landscape"),
      climate: formData.get("climate"),
      biodiversity: formData.get("biodiversity"),
      seasonality: formData.get("seasonality"),
      traditionalPractices: formData.get("traditionalPractices"),
      historicalContext: formData.get("historicalContext"),
      originStory: formData.get("originStory"),
      verificationStatus: formData.get("verificationStatus"),
      isActive: formData.get("isActive") === "on",
    };

    const parsed = originUpdateSchema.safeParse(raw);

    if (!parsed.success) {
      throw new Error("Validation failed");
    }

    await updateOrigin(id, parsed.data, {
      actor: {
        id: writeAdminContext.adminUserId,
        email: writeAdminContext.email,
        role: writeAdminContext.roleName,
      },
    });
  }

  return (
    <div className="space-y-6">
      <Heading
        title={`Edit ${origin.name}`}
        subtitle="Update the origin record used by the backend foundation and future admin workflows."
        alignment="left"
      />
      <form
        action={updateOriginAction}
        className="space-y-6 rounded-2xl border border-border bg-background p-6 shadow-sm"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <label className="space-y-2 text-sm text-muted">
            <span className="text-foreground">Name</span>
            <input
              defaultValue={origin.name}
              name="name"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
            />
          </label>
          <label className="space-y-2 text-sm text-muted">
            <span className="text-foreground">Verification status</span>
            <select
              defaultValue={origin.verificationStatus}
              name="verificationStatus"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
            >
              <option value="UNVERIFIED">Unverified</option>
              <option value="PENDING">Pending</option>
              <option value="VERIFIED">Verified</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </label>
          <label className="space-y-2 text-sm text-muted">
            <span className="text-foreground">Altitude</span>
            <input
              defaultValue={origin.altitude ?? ""}
              name="altitude"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
            />
          </label>
          <label className="space-y-2 text-sm text-muted">
            <span className="text-foreground">Active</span>
            <input
              defaultChecked={origin.isActive}
              type="checkbox"
              name="isActive"
              className="mt-2 h-4 w-4 rounded border-border"
            />
          </label>
        </div>
        <label className="space-y-2 text-sm text-muted">
          <span className="text-foreground">Landscape</span>
          <input
            defaultValue={origin.landscape ?? ""}
            name="landscape"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
          />
        </label>
        <label className="space-y-2 text-sm text-muted">
          <span className="text-foreground">Climate</span>
          <input
            defaultValue={origin.climate ?? ""}
            name="climate"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
          />
        </label>
        <label className="space-y-2 text-sm text-muted">
          <span className="text-foreground">Biodiversity</span>
          <input
            defaultValue={origin.biodiversity ?? ""}
            name="biodiversity"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
          />
        </label>
        <label className="space-y-2 text-sm text-muted">
          <span className="text-foreground">Seasonality</span>
          <input
            defaultValue={origin.seasonality ?? ""}
            name="seasonality"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
          />
        </label>
        <label className="space-y-2 text-sm text-muted">
          <span className="text-foreground">Traditional practices</span>
          <textarea
            defaultValue={origin.traditionalPractices ?? ""}
            name="traditionalPractices"
            rows={3}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
          />
        </label>
        <label className="space-y-2 text-sm text-muted">
          <span className="text-foreground">Historical context</span>
          <textarea
            defaultValue={origin.historicalContext ?? ""}
            name="historicalContext"
            rows={3}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
          />
        </label>
        <label className="space-y-2 text-sm text-muted">
          <span className="text-foreground">Origin story</span>
          <textarea
            defaultValue={origin.originStory ?? ""}
            name="originStory"
            rows={4}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
          />
        </label>
        <button
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          type="submit"
        >
          Save changes
        </button>
      </form>
    </div>
  );
}
