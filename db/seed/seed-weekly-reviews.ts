import { generateWeeklyReview } from "../../lib/weekly-review";
import { db } from "../client";
import { weeklyReviews } from "../schema";
import { eq } from "drizzle-orm";
import { addDays, today } from "../../lib/date";

/** Generates past weeks by running the real aggregation logic against already-seeded data. */
export async function seedWeeklyReviews() {
  const wins = [
    "Finally cracked the sliding window pattern cold — solved 3 mediums back to back without hints.",
    "Landed an onsite loop at Google after a strong phone screen.",
    "Shipped the CSV export feature and got positive code review feedback.",
  ];
  const weaknesses = [
    "Still slow to recognize when a problem needs a heap vs sorting.",
    "System design capacity estimation takes too long — need a faster mental template.",
    "Behavioral answers trail off without a crisp quantified result.",
  ];
  const goals = [
    "Finish the Dynamic Programming topic and do 2 mock interviews.",
    "Complete System Design roadmap through Caching + Redis, log 3 STAR stories.",
    "Apply to 5 more companies and finish PostgreSQL indexing topics.",
  ];

  for (let weeksAgo = 3; weeksAgo >= 1; weeksAgo--) {
    const weekStart = addDays(today(), -weeksAgo * 7);
    const review = await generateWeeklyReview(weekStart);
    if (review) {
      await db
        .update(weeklyReviews)
        .set({
          biggestWin: wins[3 - weeksAgo] ?? wins[0],
          biggestWeakness: weaknesses[3 - weeksAgo] ?? weaknesses[0],
          nextWeekGoals: goals[3 - weeksAgo] ?? goals[0],
        })
        .where(eq(weeklyReviews.id, review.id));
    }
  }
}
