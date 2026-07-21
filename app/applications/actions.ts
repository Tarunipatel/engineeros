"use server";

import { db } from "@/db/client";
import { applications } from "@/db/schema";
import type { ApplicationStage } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAuthenticatedUser } from "@/lib/session";

export async function updateApplicationStage(id: number, stage: ApplicationStage) {
  const user = await requireAuthenticatedUser();
  await db
    .update(applications)
    .set({ stage, updatedAt: new Date().toISOString() })
    .where(and(eq(applications.id, id), eq(applications.userId, user.id)));
  revalidatePath("/applications");
}

export async function createApplication(input: {
  company: string;
  role: string;
  stage?: ApplicationStage;
  appliedDate?: string;
  recruiterName?: string;
  referral?: boolean;
  salary?: string;
  notes?: string;
}) {
  const user = await requireAuthenticatedUser();
  const [created] = await db
    .insert(applications)
    .values({
      userId: user.id,
      company: input.company,
      role: input.role,
      stage: input.stage ?? "wishlist",
      appliedDate: input.appliedDate,
      recruiterName: input.recruiterName,
      referral: input.referral ?? false,
      salary: input.salary,
      notes: input.notes,
    })
    .returning();
  revalidatePath("/applications");
  return created;
}

export async function updateApplication(
  id: number,
  fields: Partial<{
    company: string;
    role: string;
    appliedDate: string;
    recruiterName: string;
    referral: boolean;
    salary: string;
    notes: string;
  }>
) {
  const user = await requireAuthenticatedUser();
  await db
    .update(applications)
    .set({ ...fields, updatedAt: new Date().toISOString() })
    .where(and(eq(applications.id, id), eq(applications.userId, user.id)));
  revalidatePath("/applications");
}
