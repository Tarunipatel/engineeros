import { db } from "@/db/client";
import { settings } from "@/db/schema";
import { isLocalFileDb } from "@/db/env";
import { SettingsForm } from "@/components/settings/settings-form";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [row] = await db.select().from(settings).limit(1);

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Tune your study targets and manage local data.</p>
      </div>
      <SettingsForm
        settings={{
          theme: row?.theme ?? "dark",
          weeklyGoalHours: row?.weeklyGoalHours ?? 20,
          dailyTargetMinutes: row?.dailyTargetMinutes ?? 120,
          workingHoursStart: row?.workingHoursStart ?? "09:00",
          workingHoursEnd: row?.workingHoursEnd ?? "18:00",
        }}
        canExportDb={isLocalFileDb}
      />
    </div>
  );
}
