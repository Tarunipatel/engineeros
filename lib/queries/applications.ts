import { db } from "@/db/client";
import { applications } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

export async function getAllApplications(userId: number) {
  return db.select().from(applications).where(eq(applications.userId, userId)).orderBy(asc(applications.sortOrder));
}
