"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updateWeeklyReviewNotes } from "@/app/weekly-reviews/actions";
import { StatCard } from "@/components/dashboard/stat-card";
import { Clock, Code2, GraduationCap, Briefcase, MessageSquareText } from "lucide-react";

type Review = {
  id: number;
  hoursStudied: number;
  problemsSolved: number;
  topicsFinished: number;
  applicationsSubmitted: number;
  interviewsCompleted: number;
  biggestWin: string | null;
  biggestWeakness: string | null;
  nextWeekGoals: string | null;
};

export function WeeklyReviewDetail({ review }: { review: Review }) {
  const router = useRouter();
  const [win, setWin] = useState(review.biggestWin ?? "");
  const [weakness, setWeakness] = useState(review.biggestWeakness ?? "");
  const [goals, setGoals] = useState(review.nextWeekGoals ?? "");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatCard label="Hours" value={`${review.hoursStudied}h`} icon={Clock} accent="text-accent-blue from-accent-blue/25 to-accent-blue/5" />
        <StatCard label="Problems" value={String(review.problemsSolved)} icon={Code2} accent="text-accent-green from-accent-green/25 to-accent-green/5" />
        <StatCard
          label="Topics"
          value={String(review.topicsFinished)}
          icon={GraduationCap}
          accent="text-accent-purple from-accent-purple/25 to-accent-purple/5"
        />
        <StatCard
          label="Applications"
          value={String(review.applicationsSubmitted)}
          icon={Briefcase}
          accent="text-accent-orange from-accent-orange/25 to-accent-orange/5"
        />
        <StatCard
          label="Interviews"
          value={String(review.interviewsCompleted)}
          icon={MessageSquareText}
          accent="text-accent-pink from-accent-pink/25 to-accent-pink/5"
        />
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Reflection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Biggest Win</Label>
            <Textarea value={win} onChange={(e) => setWin(e.target.value)} rows={2} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Biggest Weakness</Label>
            <Textarea value={weakness} onChange={(e) => setWeakness(e.target.value)} rows={2} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Next Week Goals</Label>
            <Textarea value={goals} onChange={(e) => setGoals(e.target.value)} rows={2} />
          </div>
          <Button
            size="sm"
            onClick={async () => {
              await updateWeeklyReviewNotes(review.id, { biggestWin: win, biggestWeakness: weakness, nextWeekGoals: goals });
              router.refresh();
            }}
          >
            Save
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
