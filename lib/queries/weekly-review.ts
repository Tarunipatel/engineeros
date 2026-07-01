import { db } from "@/db/client";
import { weeklyReviews } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function getAllWeeklyReviews() {
  return db.select().from(weeklyReviews).orderBy(desc(weeklyReviews.weekStartDate));
}

export async function getWeeklyReviewByWeekStart(weekStartDate: string) {
  return db.query.weeklyReviews.findFirst({ where: eq(weeklyReviews.weekStartDate, weekStartDate) });
}
