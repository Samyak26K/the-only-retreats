import { auth, currentUser } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

const DEVELOPMENT_ADMIN_PERMISSION_NAMES: PermissionName[] = [
  "products.read",
  "products.write",
  "inventory.read",
  "inventory.write",
  "origins.read",
  "origins.write",
  "content.read",
  "content.write",
  "support.read",
];

export const ADMIN_ROLE_NAMES = [
  "SUPER_ADMIN",
  "ADMIN",
  "OPERATIONS",
  "INVENTORY_MANAGER",
  "CONTENT_MANAGER",
  "SUPPORT",
] as const;

export type AdminRoleName = (typeof ADMIN_ROLE_NAMES)[number];
export type PermissionName =
  | "products.read"
  | "products.write"
  | "inventory.read"
  | "inventory.write"
  | "origins.read"
  | "origins.write"
  | "content.read"
  | "content.write"
  | "support.read";

export type AuthenticatedUser = {
  userId: string;
  email: string | null;
  clerkUser?: Awaited<ReturnType<typeof currentUser>>;
};

export type AdminContext = AuthenticatedUser & {
  adminUserId: string;
  roleName: AdminRoleName;
  permissions: PermissionName[];
};

export async function requireAuthenticatedUser(): Promise<AuthenticatedUser> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? null;

  return {
    userId,
    email,
    clerkUser,
  };
}

export async function requireAdmin(): Promise<AdminContext> {
  const authenticatedUser = await requireAuthenticatedUser();
  await ensureDevelopmentAdminBootstrap(authenticatedUser);

  const adminUser = await prisma.adminUser.findFirst({
    where: { clerkUserId: authenticatedUser.userId, isActive: true },
    include: {
      role: {
        include: {
          rolePermissions: {
            include: {
              permission: true,
            },
          },
        },
      },
    },
  });

  if (!adminUser?.role) {
    throw new Error("Forbidden");
  }

  const roleName = adminUser.role.name as AdminRoleName;
  const permissions = resolvePermissionsForRole(
    roleName,
    adminUser.role.rolePermissions,
  );

  return {
    ...authenticatedUser,
    adminUserId: adminUser.id,
    roleName,
    permissions,
  };
}

export async function requirePermission(
  permissionName: PermissionName,
): Promise<AdminContext> {
  const adminContext = await requireAdmin();

  if (adminContext.roleName === "SUPER_ADMIN") {
    return adminContext;
  }

  if (!adminContext.permissions.includes(permissionName)) {
    throw new Error("Forbidden");
  }

  return adminContext;
}

async function ensureDevelopmentAdminBootstrap(
  authenticatedUser: AuthenticatedUser,
) {
  const configuredUserId = process.env.DEV_ADMIN_CLERK_USER_ID?.trim();
  const isDevelopment = process.env.NODE_ENV !== "production";

  if (
    !isDevelopment ||
    !configuredUserId ||
    authenticatedUser.userId !== configuredUserId
  ) {
    return;
  }

  const clerkUser = authenticatedUser.clerkUser ?? (await currentUser());
  const resolvedEmail =
    clerkUser?.emailAddresses?.[0]?.emailAddress?.trim().toLowerCase() ?? null;
  const resolvedName =
    [clerkUser?.firstName, clerkUser?.lastName]
      .filter(Boolean)
      .join(" ")
      .trim() || null;

  const role = await prisma.role.upsert({
    where: { name: "SUPER_ADMIN" },
    update: { isActive: true, description: "Development bootstrap role" },
    create: { name: "SUPER_ADMIN", description: "Development bootstrap role" },
  });

  for (const permissionName of DEVELOPMENT_ADMIN_PERMISSION_NAMES) {
    const permission = await prisma.permission.upsert({
      where: { name: permissionName },
      update: {},
      create: {
        name: permissionName,
        description: `Permission for ${permissionName}`,
      },
    });

    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: role.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: role.id,
        permissionId: permission.id,
      },
    });
  }

  const email = resolvedEmail ?? `${authenticatedUser.userId}@local.invalid`;

  await prisma.adminUser.upsert({
    where: { clerkUserId: authenticatedUser.userId },
    update: {
      email,
      name: resolvedName,
      roleId: role.id,
      isActive: true,
    },
    create: {
      clerkUserId: authenticatedUser.userId,
      email,
      name: resolvedName,
      roleId: role.id,
      isActive: true,
    },
  });
}

function resolvePermissionsForRole(
  roleName: AdminRoleName,
  rolePermissions: Array<{ permission: { name: string } }>,
): PermissionName[] {
  const explicitPermissions = rolePermissions
    .map((entry) => entry.permission.name)
    .filter(
      (permission): permission is PermissionName =>
        permission === "products.read" ||
        permission === "products.write" ||
        permission === "inventory.read" ||
        permission === "inventory.write" ||
        permission === "origins.read" ||
        permission === "origins.write" ||
        permission === "content.read" ||
        permission === "content.write" ||
        permission === "support.read",
    );

  if (roleName === "SUPER_ADMIN") {
    return DEVELOPMENT_ADMIN_PERMISSION_NAMES;
  }

  if (roleName === "ADMIN") {
    return DEVELOPMENT_ADMIN_PERMISSION_NAMES;
  }

  if (roleName === "OPERATIONS") {
    return [
      "products.read",
      "inventory.read",
      "inventory.write",
      "support.read",
    ];
  }

  if (roleName === "INVENTORY_MANAGER") {
    return ["inventory.read", "inventory.write", "products.read"];
  }

  if (roleName === "CONTENT_MANAGER") {
    return ["products.read", "origins.read", "content.read", "content.write"];
  }

  if (roleName === "SUPPORT") {
    return ["support.read", "products.read", "origins.read"];
  }

  return explicitPermissions;
}
