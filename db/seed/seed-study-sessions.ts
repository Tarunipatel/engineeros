import { db } from "../client";
import { studySessions } from "../schema";
import { addDays, today } from "../../lib/date";

const CATEGORIES = ["dsa", "system_design", "python", "postgresql", "core_cs", "work_journal"] as const;

/**
 * Seeds ~7 weeks of backdated sessions with a few gaps so the heatmap shows
 * real variation, but keeps the most recent several days consecutive so the
 * app opens with a nonzero current streak.
 */
export async function seedStudySessions(userId: number) {
  const totalDays = 50;
  const rows: (typeof studySessions.$inferInsert)[] = [];

  for (let i = totalDays; i >= 0; i--) {
    const date = addDays(today(), -i);

    // Skip a handful of older days to create realistic gaps, but never skip
    // the most recent 6 days (guarantees a visible current streak).
    const isRecent = i <= 5;
    const skip = !isRecent && (i % 9 === 0 || i % 13 === 0);
    if (skip) continue;

    const sessionsToday = 1 + (i % 3 === 0 ? 1 : 0);
    for (let s = 0; s < sessionsToday; s++) {
      const category = CATEGORIES[(i + s) % CATEGORIES.length];
      const durationMinutes = 30 + ((i * 7 + s * 13) % 90);
      rows.push({
        userId,
        date,
        durationMinutes,
        category,
        notes: null,
      });
    }
  }

  await db.insert(studySessions).values(rows);
}
