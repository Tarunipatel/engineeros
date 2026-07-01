"use client";

import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, Star, Check } from "lucide-react";
import { toast } from "sonner";
import { getProblemDetail, updateProblemDetails, logAttempt, toggleFavorite } from "@/app/dsa/actions";
import { STATUS_LABELS, DIFFICULTY_COLORS } from "./types";
import type { AttemptResult } from "@/db/schema";
import { formatDate, isOverdue, isToday } from "@/lib/date";
import { cn } from "@/lib/utils";

const RESULT_OPTIONS: { value: AttemptResult; label: string }[] = [
  { value: "failed", label: "Failed" },
  { value: "solved_with_help", label: "Solved with help" },
  { value: "solved", label: "Solved" },
  { value: "optimal", label: "Optimal" },
];

export function ProblemDetailSheet({
  problemId,
  open,
  onOpenChange,
}: {
  problemId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const { data: problem } = useQuery({
    queryKey: ["dsa-problem", problemId],
    queryFn: () => (problemId ? getProblemDetail(problemId) : null),
    enabled: open && problemId != null,
  });

  const [notes, setNotes] = useState("");
  const [mistakes, setMistakes] = useState("");
  const [result, setResult] = useState<AttemptResult>("solved");
  const [timeTaken, setTimeTaken] = useState("");
  const [confidence, setConfidence] = useState("3");

  // Reset form fields only when the selected problem changes, not on every
  // refetch (e.g. after saving notes) — that would clobber in-progress edits.
  useEffect(() => {
    if (problem) {
      setNotes(problem.notes ?? "");
      setMistakes(problem.mistakes ?? "");
      setTimeTaken(problem.timeTakenMinutes ? String(problem.timeTakenMinutes) : "");
      setConfidence(problem.confidence ? String(problem.confidence) : "3");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problem?.id]);

  if (!problem) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="sm:max-w-lg" />
      </Sheet>
    );
  }

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["dsa-problem", problemId] });
    queryClient.invalidateQueries({ queryKey: ["dsa-problems"] });
  };

  const saveNotes = async () => {
    await updateProblemDetails(problem.id, { notes, mistakes });
    invalidate();
    toast.success("Notes saved");
  };

  const submitAttempt = async () => {
    await logAttempt(problem.id, {
      result,
      timeTakenMinutes: timeTaken ? Number(timeTaken) : undefined,
      confidence: confidence ? Number(confidence) : undefined,
    });
    invalidate();
    toast.success("Attempt logged, revision scheduled");
  };

  const overdue = problem.nextRevisionDate ? isOverdue(problem.nextRevisionDate) : false;
  const dueToday = problem.nextRevisionDate ? isToday(problem.nextRevisionDate) : false;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <div className="flex items-start justify-between gap-2 pr-8">
            <SheetTitle className="text-left">{problem.title}</SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0"
              onClick={async () => {
                await toggleFavorite(problem.id, !problem.favorite);
                invalidate();
              }}
            >
              <Star className={cn("h-4 w-4", problem.favorite && "fill-amber-400 text-amber-400")} />
            </Button>
          </div>
          <SheetDescription className="flex flex-wrap items-center gap-1.5 pt-1">
            <Badge variant="outline" className={DIFFICULTY_COLORS[problem.difficulty]}>
              {problem.difficulty}
            </Badge>
            <Badge variant="secondary">{problem.topic?.name}</Badge>
            {problem.pattern && <Badge variant="secondary">{problem.pattern.name}</Badge>}
            <Badge variant="outline">{STATUS_LABELS[problem.status]}</Badge>
            {problem.url && (
              <a
                href={problem.url}
                target="_blank"
                rel="noreferrer"
                className="ml-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                {problem.platform} <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 px-4 pb-6">
          {problem.companyTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {problem.companyTags.map((c) => (
                <Badge key={c} variant="outline" className="text-[10px] text-muted-foreground">
                  {c}
                </Badge>
              ))}
            </div>
          )}

          {problem.nextRevisionDate && (
            <div
              className={cn(
                "rounded-md border px-3 py-2 text-xs",
                overdue
                  ? "border-destructive/30 bg-destructive/10 text-destructive"
                  : dueToday
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-border text-muted-foreground"
              )}
            >
              Next revision: {formatDate(problem.nextRevisionDate)}{" "}
              {overdue ? "(overdue)" : dueToday ? "(today)" : ""}
            </div>
          )}

          <div className="space-y-3">
            <h3 className="text-sm font-medium">Log an attempt</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Result</Label>
                <Select value={result} onValueChange={(v) => setResult(v as AttemptResult)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RESULT_OPTIONS.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Time taken (min)</Label>
                <Input value={timeTaken} onChange={(e) => setTimeTaken(e.target.value)} type="number" />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label className="text-xs text-muted-foreground">Confidence (1-5)</Label>
                <Select value={confidence} onValueChange={setConfidence}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button size="sm" onClick={submitAttempt} className="w-full">
              <Check className="h-3.5 w-3.5" /> Log attempt
            </Button>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Notes</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Mistakes</Label>
              <Textarea value={mistakes} onChange={(e) => setMistakes(e.target.value)} rows={2} />
            </div>
            <Button size="sm" variant="secondary" onClick={saveNotes}>
              Save notes
            </Button>
          </div>

          {problem.attempts.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Attempt history</h3>
                {problem.attempts.map((a) => (
                  <div key={a.id} className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{formatDate(a.attemptDate)}</span>
                    <span className="capitalize">{a.result.replace(/_/g, " ")}</span>
                    <span>{a.timeTakenMinutes ? `${a.timeTakenMinutes}m` : "—"}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
