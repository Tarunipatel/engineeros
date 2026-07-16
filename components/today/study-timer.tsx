"use client";

import { useRouter } from "next/navigation";
import { useTimerStore } from "@/stores/timer-store";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, Square, Timer as TimerIcon } from "lucide-react";
import { upsertStudySession } from "@/app/today/actions";
import { toast } from "sonner";
import { CATEGORY_LABELS, formatElapsed } from "./timer-format";

export function StudyTimer() {
  const router = useRouter();
  const { running, elapsedSeconds, category, sessionId, setCategory, start, pause, reset, setSessionId } =
    useTimerStore();

  const handleStart = async () => {
    start();
    if (!sessionId) {
      const created = await upsertStudySession({ durationMinutes: 0, category });
      if (created) setSessionId(created.id);
    }
  };

  const handleStop = async () => {
    pause();
    const minutes = Math.max(1, Math.round(elapsedSeconds / 60));
    await upsertStudySession({ id: sessionId ?? undefined, durationMinutes: minutes, category });
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
            <Button className="flex-1" size="sm" onClick={handleStart}>
              <Play className="h-3.5 w-3.5" /> Start
            </Button>
          ) : (
            <Button className="flex-1" size="sm" variant="secondary" onClick={pause}>
              <Pause className="h-3.5 w-3.5" /> Pause
            </Button>
          )}
          <Button size="sm" variant="outline" disabled={elapsedSeconds === 0} onClick={handleStop}>
            <Square className="h-3.5 w-3.5" /> Stop &amp; log
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
