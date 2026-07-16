"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquareOff } from "lucide-react";
import { InterviewEntryDialog, type InterviewEntryData } from "./interview-entry-dialog";
import { formatDate } from "@/lib/date";

const RESULT_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "outline",
  passed: "default",
  offer: "default",
  failed: "destructive",
  no_offer: "destructive",
};

export function InterviewJournalList({ entries }: { entries: (InterviewEntryData & { application?: unknown })[] }) {
  const [creating, setCreating] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setCreating(true)}>
          <Plus className="h-3.5 w-3.5" /> Log interview
        </Button>
      </div>

      <div className="space-y-2">
        {entries.map((e) => (
          <Link key={e.id} href={`/interview-journal/${e.id}`}>
            <Card interactive className="border-border/60">
              <CardContent className="flex items-center justify-between px-4 py-3">
                <div className="min-w-0">
                  <p className="font-medium">
                    {e.company} <span className="text-muted-foreground font-normal">· {e.round}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{formatDate(e.date)}</p>
                </div>
                <Badge variant={RESULT_VARIANTS[e.result] ?? "outline"} className="shrink-0 capitalize">
                  {e.result.replace(/_/g, " ")}
                </Badge>
              </CardContent>
            </Card>
          </Link>
        ))}
        {entries.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-12 text-center">
            <MessageSquareOff className="h-8 w-8 text-muted-foreground/50" strokeWidth={1.5} />
            <p className="text-sm text-muted-foreground">No interviews logged yet.</p>
          </div>
        )}
      </div>

      <InterviewEntryDialog open={creating} onOpenChange={setCreating} entry={null} />
    </div>
  );
}
