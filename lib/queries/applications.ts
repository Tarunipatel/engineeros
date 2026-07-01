import { db } from "@/db/client";
import { applications } from "@/db/schema";
import { asc } from "drizzle-orm";

export async function getAllApplications() {
  return db.select().from(applications).orderBy(asc(applications.sortOrder));
}
