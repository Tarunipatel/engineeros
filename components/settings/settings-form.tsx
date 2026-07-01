"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateSettings, clearProgressData } from "@/app/settings/actions";
import { toast } from "sonner";
import { Download, RotateCcw, Save } from "lucide-react";

type SettingsData = {
  theme: "dark" | "light";
  weeklyGoalHours: number;
  dailyTargetMinutes: number;
  workingHoursStart: string;
  workingHoursEnd: string;
};

export function SettingsForm({ settings, canExportDb }: { settings: SettingsData; canExportDb: boolean }) {
  const router = useRouter();
  const { setTheme } = useTheme();
  const [form, setForm] = useState(settings);
  const [resetting, setResetting] = useState(false);

  const save = async () => {
    await updateSettings(form);
    setTheme(form.theme);
    toast.success("Settings saved");
    router.refresh();
  };

  const handleReset = async () => {
    if (
      !window.confirm(
        "This clears all tracked progress — problem statuses, study sessions, journal entries, applications, and weekly reviews — back to zero. The problem bank and roadmap topics stay. This cannot be undone. Continue?"
      )
    )
      return;
    setResetting(true);
    await clearProgressData();
    setResetting(false);
    toast.success("Progress cleared — starting fresh");
    router.refresh();
  };

  return (
    <div className="space-y-4">
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Theme</Label>
              <Select value={form.theme} onValueChange={(v) => setForm({ ...form, theme: v as "dark" | "light" })}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Weekly Study Goal (hours)</Label>
              <Input
                type="number"
                value={form.weeklyGoalHours}
                onChange={(e) => setForm({ ...form, weeklyGoalHours: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Daily Target (minutes)</Label>
              <Input
                type="number"
                value={form.dailyTargetMinutes}
                onChange={(e) => setForm({ ...form, dailyTargetMinutes: Number(e.target.value) })}
              />
            </div>
            <div />
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Working Hours Start</Label>
              <Input
                type="time"
                value={form.workingHoursStart}
                onChange={(e) => setForm({ ...form, workingHoursStart: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Working Hours End</Label>
              <Input
                type="time"
                value={form.workingHoursEnd}
                onChange={(e) => setForm({ ...form, workingHoursEnd: e.target.value })}
              />
            </div>
          </div>
          <Button size="sm" onClick={save}>
            <Save className="h-3.5 w-3.5" /> Save settings
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Data</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-2">
          {canExportDb ? (
            <Button asChild size="sm" variant="secondary">
              <a href="/api/export-db" download>
                <Download className="h-3.5 w-3.5" /> Export database
              </a>
            </Button>
          ) : (
            <p className="text-xs text-muted-foreground">
              Export isn&apos;t available for a remote database — use the Turso CLI or dashboard instead.
            </p>
          )}
          <Button size="sm" variant="destructive" onClick={handleReset} disabled={resetting}>
            <RotateCcw className="h-3.5 w-3.5" /> {resetting ? "Clearing..." : "Clear all progress"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
