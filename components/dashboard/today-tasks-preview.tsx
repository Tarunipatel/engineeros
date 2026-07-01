import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { ListChecks } from "lucide-react";

type PlanProblem = { id: number; title: string; kind: string; completed: boolean; topicName: string };
type Topic = { title: string } | null | undefined;

export function TodayTasksPreview({
  planProblems,
  systemDesignTopic,
  pythonTopic,
  postgresqlTopic,
  coreCsTopic,
}: {
  planProblems: PlanProblem[];
  systemDesignTopic: Topic;
  pythonTopic: Topic;
  postgresqlTopic: Topic;
  coreCsTopic: Topic;
}) {
  const topicTasks = [
    systemDesignTopic && { label: "System Design", title: systemDesignTopic.title },
    pythonTopic && { label: "Python", title: pythonTopic.title },
    postgresqlTopic && { label: "PostgreSQL", title: postgresqlTopic.title },
    coreCsTopic && { label: "Core CS", title: coreCsTopic.title },
  ].filter(Boolean) as { label: string; title: string }[];

  const completedCount = planProblems.filter((p) => p.completed).length;

  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <ListChecks className="h-4 w-4 text-muted-foreground" />
          Today&apos;s Tasks
        </CardTitle>
        <Link href="/today" className="text-xs text-muted-foreground hover:text-foreground">
          Open plan
        </Link>
      </CardHeader>
      <CardContent className="space-y-1 pt-0">
        {planProblems.length > 0 && (
          <p className="px-2 pb-1 text-xs text-muted-foreground">
            {completedCount} of {planProblems.length} problems done
          </p>
        )}
        {planProblems.slice(0, 4).map((p) => (
          <div key={p.id} className="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm">
            <Checkbox checked={p.completed} disabled />
            <span className={p.completed ? "flex-1 truncate text-muted-foreground line-through" : "flex-1 truncate"}>
              {p.title}
            </span>
            <Badge variant={p.kind === "revision" ? "outline" : "secondary"} className="text-[10px]">
              {p.kind === "revision" ? "Revision" : "New"}
            </Badge>
          </div>
        ))}
        {topicTasks.map((t) => (
          <div key={t.label} className="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm">
            <Checkbox disabled />
            <span className="flex-1 truncate">{t.title}</span>
            <Badge variant="outline" className="text-[10px]">
              {t.label}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
