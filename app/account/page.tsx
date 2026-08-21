import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AddressSection } from "@/components/account/AddressSection";
import { WishlistSection } from "@/components/account/WishlistSection";
import { SignOutButton } from "@/components/shared/SignOutButton";
import { Container } from "@/components/ui/Container";
import { prisma } from "@/lib/prisma";

function statusColor(status: string) {
  switch (status) {
    case "DELIVERED":
      return "bg-green-50 text-green-700";
    case "CONFIRMED":
      return "bg-gold/10 text-gold";
    case "PROCESSING":
      return "bg-blue-50 text-blue-700";
    case "CANCELLED":
      return "bg-red-50 text-red-600";
    default:
      return "bg-surface text-muted";
  }
}

export default async function AccountPage() {
  const user = await currentUser();
  if (!user) redirect("/account/sign-in");

  const userEmail = user.emailAddresses[0]?.emailAddress;

  const customer = userEmail
    ? await prisma.customer.findFirst({
        where: {
          OR: [{ email: userEmail }, { clerkUserId: user.id }],
        },
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
              fulfillmentStatus: true,
            },
          },
        },
      })
    : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="h-(--navbar-height-mobile) md:h-(--navbar-height-tablet) lg:h-(--navbar-height-desktop)" />

      <Container className="py-10 md:py-16">
        <div className="mb-10 flex items-start justify-between border-b border-border pb-6">
          <div>
            <p className="mb-1 text-[0.6rem] uppercase tracking-[0.24em] text-gold">
              My Account
            </p>
            <h1 className="font-display text-3xl text-foreground">
              {user.firstName
                ? `${user.firstName} ${user.lastName ?? ""}`.trim()
                : "My Account"}
            </h1>
            <p className="mt-1 text-sm text-muted">
              {user.emailAddresses[0]?.emailAddress}
            </p>
          </div>
          <SignOutButton />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr] lg:gap-12">
          <nav className="space-y-1">
            {[
              { label: "Orders", href: "#orders", icon: "📦" },
              { label: "Edit Profile", href: "#profile", icon: "✎" },
              { label: "Saved Addresses", href: "#addresses", icon: "◎" },
              { label: "Wishlist", href: "#wishlist", icon: "♡" },
              { label: "Rewards", href: "#rewards", icon: "✦" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-muted transition-colors hover:bg-surface hover:text-foreground"
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="space-y-10">
            <section id="orders">
              <h2 className="mb-4 font-heading text-base font-semibold tracking-[0.15em] text-foreground uppercase">
                Your Orders
              </h2>
              {!customer || customer.orders.length === 0 ? (
                <div className="rounded-2xl border border-border py-12 text-center">
                  <p className="mb-3 text-2xl">📦</p>
                  <p className="mb-4 text-sm text-muted">No orders yet</p>
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2 text-xs tracking-[0.15em] text-foreground uppercase transition-colors hover:border-gold hover:text-gold"
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
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-right">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[0.6rem] tracking-wide uppercase ${statusColor(order.status)}`}
                        >
                          {order.status}
                        </span>
                        <p className="text-sm font-medium text-foreground">
                          ₹{Number(order.total).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section id="profile" className="border-t border-border pt-10">
              <h2 className="mb-4 font-heading text-base font-semibold tracking-[0.15em] text-foreground uppercase">
                Edit Profile
              </h2>
              <div className="space-y-4 rounded-2xl border border-border bg-surface p-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="mb-1 text-xs text-muted">First Name</p>
                    <p className="text-sm font-medium text-foreground">
                      {user.firstName ?? "—"}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 text-xs text-muted">Last Name</p>
                    <p className="text-sm font-medium text-foreground">
                      {user.lastName ?? "—"}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 text-xs text-muted">Email</p>
                    <p className="text-sm font-medium text-foreground">
                      {user.emailAddresses[0]?.emailAddress ?? "—"}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 text-xs text-muted">Phone</p>
                    <p className="text-sm font-medium text-foreground">
                      {user.phoneNumbers[0]?.phoneNumber ?? "—"}
                    </p>
                  </div>
                </div>
                <p className="pt-2 text-xs text-muted">
                  To update your profile details, visit{" "}
                  <a
                    href="https://accounts.clerk.dev"
                    target="_blank"
                    rel="noreferrer"
                    className="text-gold underline underline-offset-2"
                  >
                    your account settings
                  </a>
                </p>
              </div>
            </section>

            <section id="addresses" className="border-t border-border pt-10">
              <h2 className="mb-4 font-heading text-base font-semibold tracking-[0.15em] text-foreground uppercase">
                Saved Addresses
              </h2>
              <AddressSection />
            </section>

            <section id="wishlist" className="border-t border-border pt-10">
              <h2 className="mb-4 font-heading text-base font-semibold tracking-[0.15em] text-foreground uppercase">
                Wishlist
              </h2>
              <WishlistSection />
            </section>

            <section id="rewards" className="border-t border-border pt-10">
              <h2 className="mb-4 font-heading text-base font-semibold tracking-[0.15em] text-foreground uppercase">
                Rewards & Coupons
              </h2>
              <div className="rounded-2xl border border-dashed border-border p-8 text-center">
                <p className="mb-3 text-2xl">✦</p>
                <p className="text-sm text-muted">No rewards or coupons yet</p>
                <p className="mt-1 text-xs text-muted/60">
                  Complete your first order to earn rewards
                </p>
              </div>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}
