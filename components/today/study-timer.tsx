"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTimerStore } from "@/stores/timer-store";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, Square, Timer as TimerIcon } from "lucide-react";
import { logStudySession } from "@/app/today/actions";
import { toast } from "sonner";

const CATEGORY_LABELS: Record<string, string> = {
  dsa: "DSA",
  system_design: "System Design",
  python: "Python",
  postgresql: "PostgreSQL",
  core_cs: "Core CS",
  work_journal: "Work Journal",
  other: "Other",
};

function formatElapsed(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

export function StudyTimer() {
  const router = useRouter();
  const { running, elapsedSeconds, category, setCategory, start, pause, reset, tick } = useTimerStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(tick, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, tick]);

  const handleStop = async () => {
    pause();
    const minutes = Math.max(1, Math.round(elapsedSeconds / 60));
    await logStudySession({ durationMinutes: minutes, category });
    reset();
    toast.success(`Logged ${minutes} min of ${CATEGORY_LABELS[category]}`);
    router.refresh();
  };

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <TimerIcon className="h-4 w-4 text-muted-foreground" />
          Study Timer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-center text-3xl font-semibold tabular-nums">{formatElapsed(elapsedSeconds)}</p>
        <Select value={category} onValueChange={(v) => setCategory(v as never)} disabled={running}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          {!running ? (
            <Button className="flex-1" size="sm" onClick={start}>
              <Play className="h-3.5 w-3.5" /> Start
            </Button>
          ) : (
            <Button className="flex-1" size="sm" variant="secondary" onClick={pause}>
              <Pause className="h-3.5 w-3.5" /> Pause
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            disabled={elapsedSeconds === 0}
            onClick={handleStop}
          >
            <Square className="h-3.5 w-3.5" /> Stop &amp; log
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
