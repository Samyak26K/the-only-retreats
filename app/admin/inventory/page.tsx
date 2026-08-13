import { Heading } from "@/components/ui/Heading";
import { requirePermission } from "@/lib/server/auth";
import { getInventory } from "@/lib/services/inventory";

export default async function AdminInventoryPage() {
  const adminContext = await requirePermission("inventory.read").catch(
    () => null,
  );

  if (!adminContext) {
    return null;
  }

  let inventory: Awaited<ReturnType<typeof getInventory>> = [];
  let error: string | null = null;

  try {
    inventory = await getInventory();
  } catch {
    error = "Unable to load inventory right now.";
  }

  return (
    <div className="space-y-6">
      <Heading
        title="Inventory"
        subtitle="Operational inventory visibility with adjustment support for future warehouse workflows."
        alignment="left"
      />
      {error ? (
        <div className="rounded-2xl border border-dashed border-border bg-background p-6 text-sm text-muted">
          {error}
        </div>
      ) : null}
      <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
        {inventory.length === 0 ? (
          <div className="p-8 text-sm text-muted">
            No inventory records are available yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border text-sm">
              <thead className="bg-muted/20 text-left text-xs uppercase tracking-[0.24em] text-muted">
                <tr>
                  <th className="px-4 py-3">Variant</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">On hand</th>
                  <th className="px-4 py-3">Reserved</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-background">
                {inventory.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-4 text-foreground">
                      {item.productVariantId}
                    </td>
                    <td className="px-4 py-4 text-muted">
                      {item.inventoryLocationId}
                    </td>
                    <td className="px-4 py-4 text-muted">
                      {item.quantityOnHand}
                    </td>
                    <td className="px-4 py-4 text-muted">
                      {item.quantityReserved}
                    </td>
                    <td className="px-4 py-4 text-muted">{item.status}</td>
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
