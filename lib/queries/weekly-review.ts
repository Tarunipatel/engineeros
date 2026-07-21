import { db } from "@/db/client";
import { weeklyReviews } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";

export async function getAllWeeklyReviews(userId: number) {
  return db
    .select()
    .from(weeklyReviews)
    .where(eq(weeklyReviews.userId, userId))
    .orderBy(desc(weeklyReviews.weekStartDate));
}

export async function getWeeklyReviewByWeekStart(userId: number, weekStartDate: string) {
  return db.query.weeklyReviews.findFirst({
    where: and(eq(weeklyReviews.userId, userId), eq(weeklyReviews.weekStartDate, weekStartDate)),
  });
}
