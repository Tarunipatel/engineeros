import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/date";
import Link from "next/link";
import { NotebookPen } from "lucide-react";

type Entry = { id: number; title: string; type: string; date: string };

const TYPE_LABELS: Record<string, string> = {
  feature_built: "Feature",
  bug_fixed: "Bug Fix",
  interesting_sql: "SQL",
  interesting_python: "Python",
  architecture_learning: "Architecture",
  production_issue: "Incident",
  code_review_feedback: "Review",
  resume_worthy: "Resume",
  star_story: "STAR",
};

export function RecentWorkLearnings({ entries }: { entries: Entry[] }) {
  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <NotebookPen className="h-4 w-4 text-muted-foreground" />
          Recent Work Learnings
        </CardTitle>
        <Link href="/work-journal" className="text-xs text-muted-foreground hover:text-foreground">
          View all
        </Link>
      </CardHeader>
      <CardContent className="space-y-1 pt-0">
        {entries.length === 0 && (
          <p className="py-6 text-center text-sm text-muted-foreground">No entries yet.</p>
        )}
        {entries.map((e) => (
          <Link
            key={e.id}
            href="/work-journal"
            className="flex items-center justify-between gap-3 rounded-md px-2 py-2 text-sm hover:bg-accent/50"
          >
            <p className="min-w-0 truncate font-medium">{e.title}</p>
            <div className="flex shrink-0 items-center gap-2">
              <Badge variant="secondary" className="text-[10px]">
                {TYPE_LABELS[e.type] ?? e.type}
              </Badge>
              <span className="text-xs text-muted-foreground">{formatDate(e.date, "MMM D")}</span>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
