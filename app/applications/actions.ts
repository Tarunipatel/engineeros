"use server";

import { db } from "@/db/client";
import { applications } from "@/db/schema";
import type { ApplicationStage } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateApplicationStage(id: number, stage: ApplicationStage) {
  await db.update(applications).set({ stage, updatedAt: new Date().toISOString() }).where(eq(applications.id, id));
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
  const [created] = await db
    .insert(applications)
    .values({
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
  await db
    .update(applications)
    .set({ ...fields, updatedAt: new Date().toISOString() })
    .where(eq(applications.id, id));
  revalidatePath("/applications");
}
