"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatDate } from "@/lib/date";
import type { HeatmapDay } from "@/lib/streak";
import dayjs from "dayjs";

function levelFor(minutes: number) {
  if (minutes === 0) return 0;
  if (minutes < 30) return 1;
  if (minutes < 60) return 2;
  if (minutes < 120) return 3;
  return 4;
}

const LEVEL_CLASSES = [
  "bg-muted",
  "bg-accent-blue/25",
  "bg-accent-blue/50",
  "bg-accent-blue/75",
  "bg-accent-blue",
];

export function ActivityHeatmap({ data }: { data: HeatmapDay[] }) {
  // Group into weeks (columns), Sunday-start, matching GitHub's layout.
  const weeks: HeatmapDay[][] = [];
  let currentWeek: HeatmapDay[] = [];

  const firstDow = dayjs(data[0]?.date).day();
  for (let i = 0; i < firstDow; i++) currentWeek.push({ date: "", minutes: -1 });

  for (const day of data) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) weeks.push(currentWeek);

  return (
    <div className="space-y-2">
      <div className="flex gap-[3px] overflow-x-auto pb-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((day, di) =>
              day.minutes === -1 ? (
                <div key={di} className="h-[11px] w-[11px]" />
              ) : (
                <Tooltip key={di}>
                  <TooltipTrigger asChild>
                    <div
                      className={`h-[11px] w-[11px] rounded-[3px] transition-transform duration-100 hover:scale-125 ${LEVEL_CLASSES[levelFor(day.minutes)]}`}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">
                      {day.minutes > 0 ? `${day.minutes} min` : "No study"} · {formatDate(day.date)}
                    </p>
                  </TooltipContent>
                </Tooltip>
              )
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end gap-1 text-[10px] text-muted-foreground">
        <span>Less</span>
        {LEVEL_CLASSES.map((cls, i) => (
          <div key={i} className={`h-[10px] w-[10px] rounded-[2px] ${cls}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
