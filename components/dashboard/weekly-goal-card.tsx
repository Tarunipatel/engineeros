import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target } from "lucide-react";

export function WeeklyGoalCard({ hoursStudied, weeklyGoalHours }: { hoursStudied: number; weeklyGoalHours: number }) {
  const pct = weeklyGoalHours > 0 ? Math.min(100, Math.round((hoursStudied / weeklyGoalHours) * 100)) : 0;

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Target className="h-4 w-4 text-muted-foreground" />
          Weekly Goal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-semibold tabular-nums">{hoursStudied}h</span>
          <span className="text-sm text-muted-foreground">of {weeklyGoalHours}h</span>
        </div>
        <Progress value={pct} className="h-1.5" />
        <p className="text-xs text-muted-foreground">{pct}% of this week&apos;s goal</p>
      </CardContent>
    </Card>
  );
}
