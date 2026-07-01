"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createInterviewEntry, updateInterviewEntry } from "@/app/interview-journal/actions";
import { today } from "@/lib/date";
import type { InterviewResult } from "@/db/schema";

const RESULTS: { value: InterviewResult; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "passed", label: "Passed" },
  { value: "failed", label: "Failed" },
  { value: "no_offer", label: "No Offer" },
  { value: "offer", label: "Offer" },
];

export type InterviewEntryData = {
  id: number;
  company: string;
  round: string;
  date: string;
  questions: string[];
  performanceRating: number | null;
  mistakes: string | null;
  lessons: string | null;
  topicsToRevise: string[];
  result: InterviewResult;
};

export function InterviewEntryDialog({
  open,
  onOpenChange,
  entry,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry: InterviewEntryData | null;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    company: "",
    round: "",
    date: today(),
    questions: "",
    performanceRating: "3",
    mistakes: "",
    lessons: "",
    topicsToRevise: "",
    result: "pending" as InterviewResult,
  });

  useEffect(() => {
    if (entry) {
      setForm({
        company: entry.company,
        round: entry.round,
        date: entry.date,
        questions: entry.questions.join("\n"),
        performanceRating: entry.performanceRating ? String(entry.performanceRating) : "3",
        mistakes: entry.mistakes ?? "",
        lessons: entry.lessons ?? "",
        topicsToRevise: entry.topicsToRevise.join(", "),
        result: entry.result,
      });
    } else if (open) {
      setForm({
        company: "",
        round: "",
        date: today(),
        questions: "",
        performanceRating: "3",
        mistakes: "",
        lessons: "",
        topicsToRevise: "",
        result: "pending",
      });
    }
  }, [entry, open]);

  const save = async () => {
    const payload = {
      company: form.company,
      round: form.round,
      date: form.date,
      questions: form.questions.split("\n").map((q) => q.trim()).filter(Boolean),
      performanceRating: Number(form.performanceRating),
      mistakes: form.mistakes,
      lessons: form.lessons,
      topicsToRevise: form.topicsToRevise.split(",").map((t) => t.trim()).filter(Boolean),
      result: form.result,
    };
    if (entry) await updateInterviewEntry(entry.id, payload);
    else await createInterviewEntry(payload);
    onOpenChange(false);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{entry ? "Edit Interview" : "Log Interview"}</DialogTitle>
        </DialogHeader>
        <div className="max-h-[65vh] space-y-3 overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Company</Label>
              <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Round</Label>
              <Input value={form.round} onChange={(e) => setForm({ ...form, round: e.target.value })} placeholder="Phone Screen" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Date</Label>
              <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Result</Label>
              <Select value={form.result} onValueChange={(v) => setForm({ ...form, result: v as InterviewResult })}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RESULTS.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label className="text-xs text-muted-foreground">Performance (1-5)</Label>
              <Select value={form.performanceRating} onValueChange={(v) => setForm({ ...form, performanceRating: v })}>
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
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Questions (one per line)</Label>
            <Textarea value={form.questions} onChange={(e) => setForm({ ...form, questions: e.target.value })} rows={3} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Mistakes</Label>
            <Textarea value={form.mistakes} onChange={(e) => setForm({ ...form, mistakes: e.target.value })} rows={2} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Lessons</Label>
            <Textarea value={form.lessons} onChange={(e) => setForm({ ...form, lessons: e.target.value })} rows={2} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Topics to Revise (comma separated)</Label>
            <Input value={form.topicsToRevise} onChange={(e) => setForm({ ...form, topicsToRevise: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button size="sm" onClick={save} disabled={!form.company || !form.round}>
            {entry ? "Save changes" : "Log interview"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
