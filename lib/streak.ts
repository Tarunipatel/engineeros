import { db } from "@/db/client";
import { studySessions } from "@/db/schema";
import { and, eq, gte, sql } from "drizzle-orm";
import dayjs from "dayjs";
import { addDays, today } from "./date";

export type HeatmapDay = { date: string; minutes: number };

/** Consecutive days (walking back from today) with at least one study session. */
export async function computeStreak(userId: number): Promise<number> {
  const rows = await db
    .select({ date: studySessions.date, minutes: sql<number>`sum(${studySessions.durationMinutes})` })
    .from(studySessions)
    .where(eq(studySessions.userId, userId))
    .groupBy(studySessions.date);

  const daysWithActivity = new Set(rows.filter((r) => r.minutes > 0).map((r) => r.date));

  let streak = 0;
  let cursor = today();
  // Allow today to be empty (studying "later today") without breaking the streak.
  if (!daysWithActivity.has(cursor)) {
    cursor = dayjs(cursor).subtract(1, "day").format("YYYY-MM-DD");
  }
  while (daysWithActivity.has(cursor)) {
    streak++;
    cursor = dayjs(cursor).subtract(1, "day").format("YYYY-MM-DD");
  }
  return streak;
}

export async function computeHeatmapData(userId: number, days = 182): Promise<HeatmapDay[]> {
  const start = addDays(today(), -days);
  const rows = await db
    .select({ date: studySessions.date, minutes: sql<number>`sum(${studySessions.durationMinutes})` })
    .from(studySessions)
    .where(and(eq(studySessions.userId, userId), gte(studySessions.date, start)))
    .groupBy(studySessions.date);

  const map = new Map(rows.map((r) => [r.date, r.minutes]));
  const out: HeatmapDay[] = [];
  for (let i = days; i >= 0; i--) {
    const date = addDays(today(), -i);
    out.push({ date, minutes: map.get(date) ?? 0 });
  }
  return out;
}
