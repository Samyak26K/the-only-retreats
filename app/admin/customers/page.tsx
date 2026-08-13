import { Heading } from "@/components/ui/Heading";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/server/auth";

type CustomerListItem = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  createdAt: Date;
};

export default async function AdminCustomersPage() {
  const adminContext = await requirePermission("support.read").catch(
    () => null,
  );

  if (!adminContext) {
    return null;
  }

  let customers: CustomerListItem[] = [];
  let error: string | null = null;

  try {
    customers = await prisma.customer.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        createdAt: true,
      },
    });
  } catch {
    error = "Unable to load customers right now.";
  }

  return (
    <div className="space-y-6">
      <Heading
        title="Customers"
        subtitle="Support-oriented customer visibility without exposing unnecessary sensitive detail."
        alignment="left"
      />
      {error ? (
        <div className="rounded-2xl border border-dashed border-border bg-background p-6 text-sm text-muted">
          {error}
        </div>
      ) : null}
      <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
        {customers.length === 0 ? (
          <div className="p-8 text-sm text-muted">
            No customers are available yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border text-sm">
              <thead className="bg-muted/20 text-left text-xs uppercase tracking-[0.24em] text-muted">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-background">
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="px-4 py-4 text-foreground">
                      {[customer.firstName, customer.lastName]
                        .filter(Boolean)
                        .join(" ") || "Customer"}
                    </td>
                    <td className="px-4 py-4 text-muted">
                      {customer.email ?? "—"}
                    </td>
                    <td className="px-4 py-4 text-muted">
                      {customer.phone ?? "—"}
                    </td>
                    <td className="px-4 py-4 text-muted">
                      {new Date(customer.createdAt).toLocaleDateString("en-IN")}
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
