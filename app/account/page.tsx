import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Container } from "@/components/ui/Container";
import { prisma } from "@/lib/prisma";

export default async function AccountPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/account/sign-in");
  }

  const customer = await prisma.customer.findFirst({
    where: { email: user.emailAddresses[0]?.emailAddress },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          orderNumber: true,
          status: true,
          total: true,
          createdAt: true,
          currency: true,
        },
      },
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="h-(--navbar-height-mobile) md:h-(--navbar-height-tablet) lg:h-(--navbar-height-desktop)" />

      <Container className="py-12 md:py-20">
        <div className="mb-10 border-b border-border pb-6">
          <p className="mb-1 text-[0.6rem] uppercase tracking-[0.24em] text-gold">
            My Account
          </p>
          <h1 className="font-display text-3xl text-foreground">
            {user.firstName ? `Welcome, ${user.firstName}` : "My Account"}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {user.emailAddresses[0]?.emailAddress}
          </p>
        </div>

        <div className="space-y-6">
          <h2 className="font-heading text-base font-medium uppercase tracking-[0.15em] text-foreground">
            Your Orders
          </h2>

          {!customer || customer.orders.length === 0 ? (
            <div className="rounded-2xl border border-border py-12 text-center">
              <p className="mb-4 text-sm text-muted">No orders yet</p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-2.5 text-xs uppercase tracking-[0.15em] text-foreground transition-colors hover:border-gold hover:text-gold"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {customer.orders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-xl border border-border p-4 transition-colors hover:border-gold/50"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {order.orderNumber}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">
                      ₹{Number(order.total).toLocaleString("en-IN")}
                    </p>
                    <span
                      className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[0.6rem] uppercase tracking-wide ${
                        order.status === "DELIVERED"
                          ? "bg-green-50 text-green-700"
                          : order.status === "CONFIRMED"
                            ? "bg-gold/10 text-gold"
                            : "bg-surface text-muted"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
          <Link
            href="/"
            className="text-xs text-muted transition-colors hover:text-foreground"
          >
            ← Back to Home
          </Link>
          <form method="POST" action="/api/sign-out">
            <button
              type="submit"
              className="text-xs text-muted underline underline-offset-2 transition-colors hover:text-foreground"
            >
              Sign out
            </button>
          </form>
        </div>
      </Container>
    </div>
  );
}
