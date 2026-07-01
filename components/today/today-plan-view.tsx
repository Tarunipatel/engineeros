"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { togglePlanProblem, toggleRoadmapTopicDone, saveDailyPlanFields } from "@/app/today/actions";
import { cn } from "@/lib/utils";
import { ListChecks } from "lucide-react";

type PlanProblem = { id: number; problemId: number; title: string; kind: string; completed: boolean; topicName: string };
type Topic = { id: number; title: string; status: string } | null;

export function TodayPlanView({
  planId,
  planProblems,
  systemDesignTopic,
  pythonTopic,
  postgresqlTopic,
  coreCsTopic,
  workReflection,
  endOfDayReflection,
  notes,
  timerSlot,
}: {
  planId: number;
  planProblems: PlanProblem[];
  systemDesignTopic: Topic;
  pythonTopic: Topic;
  postgresqlTopic: Topic;
  coreCsTopic: Topic;
  workReflection: string | null;
  endOfDayReflection: string | null;
  notes: string | null;
  timerSlot?: React.ReactNode;
}) {
  const router = useRouter();

  const domainTopics = [
    systemDesignTopic && { ...systemDesignTopic, label: "System Design" },
    pythonTopic && { ...pythonTopic, label: "Python" },
    postgresqlTopic && { ...postgresqlTopic, label: "PostgreSQL" },
    coreCsTopic && { ...coreCsTopic, label: "Core CS" },
  ].filter(Boolean) as { id: number; title: string; status: string; label: string }[];

  const [workReflectionValue, setWorkReflectionValue] = useState(workReflection ?? "");
  const [endOfDayValue, setEndOfDayValue] = useState(endOfDayReflection ?? "");
  const [notesValue, setNotesValue] = useState(notes ?? "");

  const completedCount = planProblems.filter((p) => p.completed).length + domainTopics.filter((t) => t.status === "completed").length;
  const totalCount = planProblems.length + domainTopics.length;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card className="border-border/60 lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-sm font-medium">
            <span className="flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-muted-foreground" />
              Today&apos;s Tasks
            </span>
            <span className="text-xs font-normal text-muted-foreground">
              {completedCount} / {totalCount} done
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {planProblems.map((p) => (
            <label
              key={p.id}
              className="flex items-center gap-2.5 rounded-md px-2 py-2 text-sm hover:bg-accent/40"
            >
              <Checkbox
                checked={p.completed}
                onCheckedChange={async (checked) => {
                  await togglePlanProblem(p.id, Boolean(checked));
                  router.refresh();
                }}
              />
              <span className={cn("flex-1", p.completed && "text-muted-foreground line-through")}>{p.title}</span>
              <Badge variant={p.kind === "revision" ? "outline" : "secondary"} className="text-[10px]">
                {p.kind === "revision" ? "Revision" : "New"}
              </Badge>
            </label>
          ))}
          {domainTopics.map((t) => (
            <label key={t.id} className="flex items-center gap-2.5 rounded-md px-2 py-2 text-sm hover:bg-accent/40">
              <Checkbox
                checked={t.status === "completed"}
                onCheckedChange={async (checked) => {
                  await toggleRoadmapTopicDone(t.id, Boolean(checked));
                  router.refresh();
                }}
              />
              <span className={cn("flex-1", t.status === "completed" && "text-muted-foreground line-through")}>
                {t.title}
              </span>
              <Badge variant="outline" className="text-[10px]">
                {t.label}
              </Badge>
            </label>
          ))}
          {totalCount === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">Nothing assigned — check back tomorrow.</p>
          )}
        </CardContent>
      </Card>

      <div className="space-y-4">
        {timerSlot}

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Reflections &amp; Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Work Reflection</Label>
            <Textarea
              value={workReflectionValue}
              onChange={(e) => setWorkReflectionValue(e.target.value)}
              placeholder="What did you learn at work today?"
              rows={2}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Notes</Label>
            <Textarea value={notesValue} onChange={(e) => setNotesValue(e.target.value)} rows={2} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">End of Day Reflection</Label>
            <Textarea
              value={endOfDayValue}
              onChange={(e) => setEndOfDayValue(e.target.value)}
              placeholder="How did today go?"
              rows={2}
            />
          </div>
          <Button
            size="sm"
            onClick={async () => {
              await saveDailyPlanFields(planId, {
                workReflection: workReflectionValue,
                endOfDayReflection: endOfDayValue,
                notes: notesValue,
              });
              router.refresh();
            }}
          >
            Save
          </Button>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
