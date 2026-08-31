import { prisma } from "../lib/prisma";

async function main() {
  const clerkUserId = "user_3Idjy8XKicEMAYG62LfOEmVXDCu";
  const email = "rugvedspeaks@gmail.com";

  // Find or create the SUPER_ADMIN role
  const role = await prisma.role.findFirst({
    where: { name: "SUPER_ADMIN" },
  });

  if (!role) {
    console.log("No SUPER_ADMIN role found in database.");
    console.log("Available roles:");
    const roles = await prisma.role.findMany();
    console.log(roles.map((r) => r.name));
    return;
  }

  // Create admin user
  const admin = await prisma.adminUser.upsert({
    where: { clerkUserId },
    update: {
      email,
      roleId: role.id,
      isActive: true,
    },
    create: {
      clerkUserId,
      email,
      roleId: role.id,
      isActive: true,
    },
  });

  console.log("✓ Admin created:", admin.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
