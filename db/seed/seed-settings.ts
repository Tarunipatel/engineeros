import { db } from "../client";
import { settings } from "../schema";

export async function seedSettings() {
  await db.insert(settings).values({
    theme: "dark",
    weeklyGoalHours: 20,
    dailyTargetMinutes: 120,
    workingHoursStart: "09:00",
    workingHoursEnd: "18:00",
  });
}
