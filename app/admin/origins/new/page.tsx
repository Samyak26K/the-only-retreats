import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/Heading";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/server/auth";
import { createOrigin } from "@/lib/services/origins";
import { originCreateSchema } from "@/lib/validation/service-schemas";

export default async function NewOriginPage() {
  const adminContext = await requirePermission("origins.write").catch(
    () => null,
  );

  if (!adminContext) {
    return null;
  }

  async function createOriginAction(formData: FormData) {
    "use server";

    if (!adminContext) {
      throw new Error("Unauthorized");
    }

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

    const parsed = originCreateSchema.safeParse(raw);

    if (!parsed.success) {
      throw new Error("Validation failed");
    }

    await createOrigin(parsed.data, {
      actor: {
        id: adminContext.adminUserId,
        email: adminContext.email,
        role: adminContext.roleName,
      },
    });
    redirect("/admin/origins");
  }

  const [regions, villages] = await Promise.all([
    prisma.region.findMany({ orderBy: { name: "asc" } }),
    prisma.village.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <Heading
        title="Create origin"
        subtitle="Record an origin entry for the heritage and traceability foundation."
        alignment="left"
      />
      <form
        action={createOriginAction}
        className="space-y-6 rounded-2xl border border-border bg-background p-6 shadow-sm"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <label className="space-y-2 text-sm text-muted">
            <span className="text-foreground">Name</span>
            <input
              name="name"
              required
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
            />
          </label>
          <label className="space-y-2 text-sm text-muted">
            <span className="text-foreground">Region</span>
            <select
              name="regionId"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
            >
              {regions.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.name}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm text-muted">
            <span className="text-foreground">Village</span>
            <select
              name="villageId"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
            >
              <option value="">None</option>
              {villages.map((village) => (
                <option key={village.id} value={village.id}>
                  {village.name}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm text-muted">
            <span className="text-foreground">Verification status</span>
            <select
              name="verificationStatus"
              defaultValue="PENDING"
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
              name="altitude"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
            />
          </label>
          <label className="space-y-2 text-sm text-muted">
            <span className="text-foreground">Active</span>
            <input
              defaultChecked
              type="checkbox"
              name="isActive"
              className="mt-2 h-4 w-4 rounded border-border"
            />
          </label>
        </div>
        <label className="space-y-2 text-sm text-muted">
          <span className="text-foreground">Landscape</span>
          <input
            name="landscape"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
          />
        </label>
        <label className="space-y-2 text-sm text-muted">
          <span className="text-foreground">Climate</span>
          <input
            name="climate"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
          />
        </label>
        <label className="space-y-2 text-sm text-muted">
          <span className="text-foreground">Biodiversity</span>
          <input
            name="biodiversity"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
          />
        </label>
        <label className="space-y-2 text-sm text-muted">
          <span className="text-foreground">Seasonality</span>
          <input
            name="seasonality"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
          />
        </label>
        <label className="space-y-2 text-sm text-muted">
          <span className="text-foreground">Traditional practices</span>
          <textarea
            name="traditionalPractices"
            rows={3}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
          />
        </label>
        <label className="space-y-2 text-sm text-muted">
          <span className="text-foreground">Historical context</span>
          <textarea
            name="historicalContext"
            rows={3}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
          />
        </label>
        <label className="space-y-2 text-sm text-muted">
          <span className="text-foreground">Origin story</span>
          <textarea
            name="originStory"
            rows={4}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
          />
        </label>
        <Button type="submit">Save origin</Button>
      </form>
    </div>
  );
}
