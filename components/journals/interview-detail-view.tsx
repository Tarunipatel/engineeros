"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { InterviewEntryDialog, type InterviewEntryData } from "./interview-entry-dialog";
import { formatDate } from "@/lib/date";

export function InterviewDetailView({ entry }: { entry: InterviewEntryData }) {
  const [editing, setEditing] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {entry.company} <span className="text-muted-foreground font-normal">· {entry.round}</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{formatDate(entry.date)}</p>
        </div>
        <Button size="sm" variant="secondary" onClick={() => setEditing(true)}>
          <Pencil className="h-3.5 w-3.5" /> Edit
        </Button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Badge variant="outline" className="capitalize">
          {entry.result.replace(/_/g, " ")}
        </Badge>
        {entry.performanceRating && <Badge variant="secondary">Performance: {entry.performanceRating}/5</Badge>}
      </div>

      {entry.questions.length > 0 && (
        <Card className="border-border/60">
          <CardContent className="p-4">
            <h3 className="mb-2 text-sm font-medium">Questions Asked</h3>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              {entry.questions.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {entry.mistakes && (
        <Card className="border-border/60">
          <CardContent className="p-4">
            <h3 className="mb-2 text-sm font-medium">Mistakes</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{entry.mistakes}</p>
          </CardContent>
        </Card>
      )}

      {entry.lessons && (
        <Card className="border-border/60">
          <CardContent className="p-4">
            <h3 className="mb-2 text-sm font-medium">Lessons</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{entry.lessons}</p>
          </CardContent>
        </Card>
      )}

      {entry.topicsToRevise.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {entry.topicsToRevise.map((t) => (
            <Badge key={t} variant="outline">
              {t}
            </Badge>
          ))}
        </div>
      )}

      <InterviewEntryDialog open={editing} onOpenChange={setEditing} entry={entry} />
    </div>
  );
}
