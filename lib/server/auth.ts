import { auth, currentUser } from "@clerk/nextjs/server";
import { cache } from "react";

import { prisma } from "@/lib/prisma";
import { timeAdminStage } from "@/lib/server/dev-timing";

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
};

export type AdminContext = AuthenticatedUser & {
  adminUserId: string;
  roleName: AdminRoleName;
  permissions: PermissionName[];
};

type AdminUserRow = {
  id: string;
  email: string;
  role: { id: string; name: string } | null;
};

/**
 * Persist bootstrap/auth memoization on globalThis so Next.js HMR / module
 * re-eval does not reset process-local guards every request.
 *
 * AdminContext TTL cache:
 * - Still requires a valid Clerk session via auth() on every request.
 * - Only memoizes the AdminUser DB read for a few seconds to absorb Neon RTT.
 * - Not an authorization bypass; revocation of the Clerk session still denies access.
 */
const ADMIN_CONTEXT_CACHE_TTL_MS = 5_000;

const globalForAuth = globalThis as unknown as {
  __adminBootstrapCompleted?: Set<string>;
  __adminBootstrapInFlight?: Map<string, Promise<void>>;
  __adminBootstrapRetryAfter?: Map<string, number>;
  __adminContextCache?: Map<
    string,
    { context: AdminContext; expiresAt: number }
  >;
};

function bootstrapCompleted() {
  if (!globalForAuth.__adminBootstrapCompleted) {
    globalForAuth.__adminBootstrapCompleted = new Set<string>();
  }
  return globalForAuth.__adminBootstrapCompleted;
}

function bootstrapInFlight() {
  if (!globalForAuth.__adminBootstrapInFlight) {
    globalForAuth.__adminBootstrapInFlight = new Map<string, Promise<void>>();
  }
  return globalForAuth.__adminBootstrapInFlight;
}

function bootstrapRetryAfter() {
  if (!globalForAuth.__adminBootstrapRetryAfter) {
    globalForAuth.__adminBootstrapRetryAfter = new Map<string, number>();
  }
  return globalForAuth.__adminBootstrapRetryAfter;
}

function adminContextCache() {
  if (!globalForAuth.__adminContextCache) {
    globalForAuth.__adminContextCache = new Map();
  }
  return globalForAuth.__adminContextCache;
}

export const requireAuthenticatedUser = cache(
  async (): Promise<AuthenticatedUser> => {
    return timeAdminStage("clerk.auth", async () => {
      const { userId, sessionClaims } = await auth();

      if (!userId) {
        throw new Error("Unauthenticated");
      }

      return {
        userId,
        email: readEmailFromSessionClaims(sessionClaims),
      };
    });
  },
);

export const requireAdmin = cache(async (): Promise<AdminContext> => {
  return timeAdminStage("auth.requireAdmin", async () => {
    const authenticatedUser = await requireAuthenticatedUser();

    const cached = adminContextCache().get(authenticatedUser.userId);
    if (cached && cached.expiresAt > Date.now()) {
      if (process.env.ADMIN_DEV_TIMING === "1") {
        console.info("[admin-timing] auth.adminContext.cacheHit: 0ms");
      }
      return cached.context;
    }

    let adminUser = await findActiveAdminUser(authenticatedUser.userId);

    if (adminUser?.role) {
      // Existence proves bootstrap is unnecessary for this process lifetime.
      bootstrapCompleted().add(authenticatedUser.userId);
      const context = await toAdminContext(authenticatedUser, adminUser);
      adminContextCache().set(authenticatedUser.userId, {
        context,
        expiresAt: Date.now() + ADMIN_CONTEXT_CACHE_TTL_MS,
      });
      return context;
    }

    // Only seed when the configured dev admin has no AdminUser row yet.
    await ensureDevelopmentAdminBootstrap(authenticatedUser);

    adminUser = await findActiveAdminUser(authenticatedUser.userId);
    if (!adminUser?.role) {
      throw new Error("Forbidden");
    }

    bootstrapCompleted().add(authenticatedUser.userId);
    const context = await toAdminContext(authenticatedUser, adminUser);
    adminContextCache().set(authenticatedUser.userId, {
      context,
      expiresAt: Date.now() + ADMIN_CONTEXT_CACHE_TTL_MS,
    });
    return context;
  });
});

export async function requirePermission(
  permissionName: PermissionName,
): Promise<AdminContext> {
  return timeAdminStage(
    `auth.requirePermission:${permissionName}`,
    async () => {
      const adminContext = await requireAdmin();

      if (adminContext.roleName === "SUPER_ADMIN") {
        return adminContext;
      }

      if (!adminContext.permissions.includes(permissionName)) {
        throw new Error("Forbidden");
      }

      return adminContext;
    },
  );
}

async function findActiveAdminUser(
  clerkUserId: string,
): Promise<AdminUserRow | null> {
  return timeAdminStage("prisma.adminUser.find", () =>
    prisma.adminUser.findFirst({
      where: { clerkUserId, isActive: true },
      select: {
        id: true,
        email: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
  );
}

async function toAdminContext(
  authenticatedUser: AuthenticatedUser,
  adminUser: AdminUserRow,
): Promise<AdminContext> {
  const roleName = adminUser.role!.name as AdminRoleName;

  const rolePermissions = isKnownAdminRole(roleName)
    ? []
    : await timeAdminStage("prisma.rolePermissions.find", () =>
        prisma.rolePermission.findMany({
          where: { roleId: adminUser.role!.id },
          select: {
            permission: {
              select: { name: true },
            },
          },
        }),
      );

  return {
    userId: authenticatedUser.userId,
    email: adminUser.email ?? authenticatedUser.email,
    adminUserId: adminUser.id,
    roleName,
    permissions: resolvePermissionsForRole(roleName, rolePermissions),
  };
}

function readEmailFromSessionClaims(sessionClaims: unknown): string | null {
  if (!sessionClaims || typeof sessionClaims !== "object") {
    return null;
  }

  const claims = sessionClaims as Record<string, unknown>;
  const direct = claims.email;
  if (typeof direct === "string" && direct.includes("@")) {
    return direct;
  }

  const primaryEmailAddress = claims.primary_email_address;
  if (
    typeof primaryEmailAddress === "string" &&
    primaryEmailAddress.includes("@")
  ) {
    return primaryEmailAddress;
  }

  return null;
}

function isDevelopmentConfiguredAdmin(userId: string) {
  const configuredUserId = process.env.DEV_ADMIN_CLERK_USER_ID?.trim();
  return (
    process.env.NODE_ENV !== "production" &&
    !!configuredUserId &&
    userId === configuredUserId
  );
}

async function ensureDevelopmentAdminBootstrap(
  authenticatedUser: AuthenticatedUser,
) {
  if (!isDevelopmentConfiguredAdmin(authenticatedUser.userId)) {
    return;
  }

  if (bootstrapCompleted().has(authenticatedUser.userId)) {
    return;
  }

  const retryAfter = bootstrapRetryAfter().get(authenticatedUser.userId);
  if (retryAfter && Date.now() < retryAfter) {
    return;
  }

  const inFlight = bootstrapInFlight().get(authenticatedUser.userId);
  if (inFlight) {
    await inFlight;
    return;
  }

  const bootstrapPromise = timeAdminStage("auth.bootstrap.seed", () =>
    seedDevelopmentAdmin(authenticatedUser),
  );
  bootstrapInFlight().set(authenticatedUser.userId, bootstrapPromise);

  try {
    await bootstrapPromise;
    bootstrapCompleted().add(authenticatedUser.userId);
    bootstrapRetryAfter().delete(authenticatedUser.userId);
  } catch (error) {
    bootstrapRetryAfter().set(authenticatedUser.userId, Date.now() + 30_000);
    console.warn(
      "[auth] Development admin bootstrap skipped after error:",
      error instanceof Error ? error.message : error,
    );
  } finally {
    bootstrapInFlight().delete(authenticatedUser.userId);
  }
}

async function seedDevelopmentAdmin(authenticatedUser: AuthenticatedUser) {
  // Caller already confirmed no active AdminUser; only seed path hits Clerk API.
  const clerkUser = await timeAdminStage("clerk.currentUser.bootstrap", () =>
    currentUser(),
  );
  const resolvedEmail =
    clerkUser?.emailAddresses?.[0]?.emailAddress?.trim().toLowerCase() ??
    authenticatedUser.email?.trim().toLowerCase() ??
    null;
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

function isKnownAdminRole(roleName: string): roleName is AdminRoleName {
  return (ADMIN_ROLE_NAMES as readonly string[]).includes(roleName);
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
