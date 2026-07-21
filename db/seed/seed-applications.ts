import { db } from "../client";
import { applications } from "../schema";
import { APPLICATIONS } from "./data/applications.data";
import { addDays, today } from "../../lib/date";

export async function seedApplications(userId: number) {
  for (let i = 0; i < APPLICATIONS.length; i++) {
    const a = APPLICATIONS[i];
    await db.insert(applications).values({
      userId,
      company: a.company,
      role: a.role,
      stage: a.stage,
      appliedDate: a.daysAgoApplied != null ? addDays(today(), -a.daysAgoApplied) : null,
      recruiterName: a.recruiterName ?? null,
      referral: a.referral ?? false,
      salary: a.salary ?? null,
      notes: a.notes ?? null,
      sortOrder: i,
    });
  }
}
