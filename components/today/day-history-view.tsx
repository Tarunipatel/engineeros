import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, ListChecks } from "lucide-react";
import { CATEGORY_LABELS } from "./timer-format";

type PlanProblem = { id: number; title: string; kind: string; completed: boolean; topicName: string };
type Topic = { title: string } | null | undefined;
type Session = { id: number; category: string; durationMinutes: number };
type Attempt = { id: number; problemTitle: string; result: string; timeTakenMinutes: number | null; confidence: number | null };

export function DayHistoryView({
  planProblems,
  systemDesignTopic,
  pythonTopic,
  postgresqlTopic,
  coreCsTopic,
  workReflection,
  endOfDayReflection,
  notes,
  sessions,
  attempts,
  totalMinutes,
}: {
  planProblems: PlanProblem[];
  systemDesignTopic: Topic;
  pythonTopic: Topic;
  postgresqlTopic: Topic;
  coreCsTopic: Topic;
  workReflection: string | null;
  endOfDayReflection: string | null;
  notes: string | null;
  sessions: Session[];
  attempts: Attempt[];
  totalMinutes: number;
}) {
  const domainTopics = [
    systemDesignTopic && { label: "System Design", title: systemDesignTopic.title },
    pythonTopic && { label: "Python", title: pythonTopic.title },
    postgresqlTopic && { label: "PostgreSQL", title: postgresqlTopic.title },
    coreCsTopic && { label: "Core CS", title: coreCsTopic.title },
  ].filter(Boolean) as { label: string; title: string }[];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card className="border-border/60 lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <ListChecks className="h-4 w-4 text-muted-foreground" />
            Assigned That Day
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {planProblems.map((p) => (
            <div key={p.id} className="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm">
              {p.completed ? (
                <Check className="h-4 w-4 text-emerald-500" />
              ) : (
                <span className="h-4 w-4 rounded-sm border border-border" />
              )}
              <span className={p.completed ? "flex-1" : "flex-1 text-muted-foreground"}>{p.title}</span>
              <Badge variant={p.kind === "revision" ? "outline" : "secondary"} className="text-[10px]">
                {p.kind === "revision" ? "Revision" : "New"}
              </Badge>
            </div>
          ))}
          {domainTopics.map((t) => (
            <div key={t.label} className="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm">
              <span className="h-4 w-4 rounded-sm border border-border" />
              <span className="flex-1">{t.title}</span>
              <Badge variant="outline" className="text-[10px]">
                {t.label}
              </Badge>
            </div>
          ))}
          {planProblems.length === 0 && domainTopics.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">Nothing was assigned this day.</p>
          )}
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Time Studied
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-2xl font-semibold tabular-nums">
              {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
            </p>
            {sessions.map((s) => (
              <div key={s.id} className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{CATEGORY_LABELS[s.category] ?? s.category}</span>
                <span>{s.durationMinutes} min</span>
              </div>
            ))}
            {sessions.length === 0 && <p className="text-xs text-muted-foreground">No study sessions logged.</p>}
          </CardContent>
        </Card>

        {attempts.length > 0 && (
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Problems Worked On</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {attempts.map((a) => (
                <div key={a.id} className="space-y-0.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="truncate">{a.problemTitle}</span>
                    <span className="text-xs capitalize text-muted-foreground">{a.result.replace(/_/g, " ")}</span>
                  </div>
                  {a.timeTakenMinutes && <p className="text-xs text-muted-foreground">{a.timeTakenMinutes} min</p>}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {(workReflection || endOfDayReflection || notes) && (
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Reflections</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              {workReflection && (
                <div>
                  <p className="text-xs font-medium text-foreground">Work Reflection</p>
                  <p>{workReflection}</p>
                </div>
              )}
              {notes && (
                <div>
                  <p className="text-xs font-medium text-foreground">Notes</p>
                  <p>{notes}</p>
                </div>
              )}
              {endOfDayReflection && (
                <div>
                  <p className="text-xs font-medium text-foreground">End of Day</p>
                  <p>{endOfDayReflection}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
