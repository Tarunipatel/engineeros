import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { isOverdue, isToday, formatDate } from "@/lib/date";
import Link from "next/link";
import { RotateCcw } from "lucide-react";

type Revision = {
  id: number;
  title: string;
  difficulty: string;
  nextRevisionDate: string | null;
  topic: { name: string } | null;
};

export function RevisionDueList({ revisions }: { revisions: Revision[] }) {
  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <RotateCcw className="h-4 w-4 text-muted-foreground" />
          Revision Due
        </CardTitle>
        <Link href="/dsa" className="text-xs text-muted-foreground hover:text-foreground">
          View all
        </Link>
      </CardHeader>
      <CardContent className="space-y-1 pt-0">
        {revisions.length === 0 && (
          <p className="py-6 text-center text-sm text-muted-foreground">Nothing due — you&apos;re all caught up.</p>
        )}
        {revisions.map((r) => {
          const overdue = r.nextRevisionDate ? isOverdue(r.nextRevisionDate) : false;
          const due = r.nextRevisionDate ? isToday(r.nextRevisionDate) : false;
          return (
            <Link
              key={r.id}
              href="/dsa"
              className="flex items-center justify-between rounded-md px-2 py-2 text-sm hover:bg-accent/50"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{r.title}</p>
                <p className="text-xs text-muted-foreground">{r.topic?.name}</p>
              </div>
              <Badge variant={overdue ? "destructive" : due ? "default" : "secondary"} className="shrink-0 text-[10px]">
                {overdue ? "Overdue" : due ? "Today" : r.nextRevisionDate ? formatDate(r.nextRevisionDate, "MMM D") : ""}
              </Badge>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
