import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, PartyPopper } from "lucide-react";

export function WeeklyGoalCard({ hoursStudied, weeklyGoalHours }: { hoursStudied: number; weeklyGoalHours: number }) {
  const pct = weeklyGoalHours > 0 ? Math.min(100, Math.round((hoursStudied / weeklyGoalHours) * 100)) : 0;
  const reached = pct >= 100;

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Target className="h-4 w-4 text-accent-blue" />
          Weekly Goal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-semibold tabular-nums">{hoursStudied}h</span>
          <span className="text-sm text-muted-foreground">of {weeklyGoalHours}h</span>
        </div>
        <Progress value={pct} className="h-1.5" indicatorClassName="bg-accent-blue" />
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          {reached && <PartyPopper className="h-3 w-3 text-accent-orange" />}
          {reached ? "Goal reached this week!" : `${pct}% of this week's goal`}
        </p>
      </CardContent>
    </Card>
  );
}
