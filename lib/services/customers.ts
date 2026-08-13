import { prisma } from "@/lib/prisma";
import {
  customerCreateSchema,
  customerUpdateSchema,
} from "@/lib/validation/service-schemas";

export type CustomerRecord = {
  id: string;
  clerkUserId: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
};

export async function getCustomerByClerkUserId(
  clerkUserId: string,
): Promise<CustomerRecord | null> {
  const customer = await prisma.customer.findUnique({
    where: { clerkUserId },
  });

  if (!customer) {
    return null;
  }

  return customer;
}

export async function createCustomer(input: unknown): Promise<CustomerRecord> {
  const parsed = customerCreateSchema.parse(input);
  const customer = await prisma.customer.create({
    data: {
      clerkUserId: parsed.clerkUserId,
      firstName: parsed.firstName ?? undefined,
      lastName: parsed.lastName ?? undefined,
      email: parsed.email ?? undefined,
      phone: parsed.phone ?? undefined,
    },
  });

  return customer;
}

export async function updateCustomer(
  id: string,
  input: unknown,
): Promise<CustomerRecord> {
  const parsed = customerUpdateSchema.parse(input);
  const customer = await prisma.customer.update({
    where: { id },
    data: {
      firstName: parsed.firstName ?? undefined,
      lastName: parsed.lastName ?? undefined,
      email: parsed.email ?? undefined,
      phone: parsed.phone ?? undefined,
    },
  });

  return customer;
}
