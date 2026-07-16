import { getDashboardData } from "@/lib/queries/dashboard";
import { getTodayPlanWithDetails } from "@/lib/queries/today";
import { greeting, weekRange, formatDate } from "@/lib/date";
import { StatCard } from "@/components/dashboard/stat-card";
import { WeeklyGoalCard } from "@/components/dashboard/weekly-goal-card";
import { ActivityHeatmap } from "@/components/dashboard/activity-heatmap";
import { RevisionDueList } from "@/components/dashboard/revision-due-list";
import { RecentWorkLearnings } from "@/components/dashboard/recent-work-learnings";
import { QuickNotes } from "@/components/dashboard/quick-notes";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { TodayTasksPreview } from "@/components/dashboard/today-tasks-preview";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Flame, Code2, Clock, Briefcase, Activity as ActivityIcon } from "lucide-react";

export const dynamic = "force-dynamic";

function motivationalLine(streak: number) {
  if (streak === 0) return "Let's start something today.";
  if (streak === 1) return "Day one — the hardest one to start. Keep going.";
  if (streak < 7) return `${streak}-day streak. Keep the momentum going.`;
  return `${streak}-day streak — you're building something real.`;
}

export default async function DashboardPage() {
  const [dashboard, todayPlan] = await Promise.all([getDashboardData(), getTodayPlanWithDetails()]);
  const { start, end } = weekRange();

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-6 py-8">
      <div>
        <h1 className="gradient-text text-3xl font-semibold tracking-tight">{greeting()}.</h1>
        <p className="mt-1.5 text-sm text-foreground/80">{motivationalLine(dashboard.streak)}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Week of {formatDate(start, "MMM D")} – {formatDate(end, "MMM D")}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Study Streak"
          value={`${dashboard.streak}d`}
          icon={Flame}
          accent={dashboard.streak > 0 ? "text-accent-orange from-accent-orange/25 to-accent-orange/5" : undefined}
        />
        <StatCard
          label="Solved This Week"
          value={String(dashboard.problemsSolvedThisWeek)}
          icon={Code2}
          accent="text-accent-green from-accent-green/25 to-accent-green/5"
        />
        <StatCard
          label="Study Hours"
          value={`${dashboard.weekHours}h`}
          sublabel="this week"
          icon={Clock}
          accent="text-accent-blue from-accent-blue/25 to-accent-blue/5"
        />
        <StatCard
          label="Applications"
          value={String(dashboard.applicationsThisWeek)}
          sublabel="this week"
          icon={Briefcase}
          accent="text-accent-purple from-accent-purple/25 to-accent-purple/5"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-border/60">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <ActivityIcon className="h-4 w-4 text-accent-blue" />
                Activity
              </CardTitle>
              <span className="text-xs text-muted-foreground">Last 26 weeks</span>
            </CardHeader>
            <CardContent>
              <ActivityHeatmap data={dashboard.heatmap} />
            </CardContent>
          </Card>

          <TodayTasksPreview
            planProblems={todayPlan.planProblems}
            systemDesignTopic={todayPlan.systemDesignTopic}
            pythonTopic={todayPlan.pythonTopic}
            postgresqlTopic={todayPlan.postgresqlTopic}
            coreCsTopic={todayPlan.coreCsTopic}
          />

          <RecentWorkLearnings entries={dashboard.recentWorkEntries} />
        </div>

        <div className="space-y-4">
          <WeeklyGoalCard hoursStudied={dashboard.weekHours} weeklyGoalHours={dashboard.settings?.weeklyGoalHours ?? 20} />
          <RevisionDueList revisions={dashboard.revisionsDue} />
          <QuickNotes />
        </div>
      </div>

      <div>
        <h2 className="mb-2 text-sm font-medium text-muted-foreground">Quick Actions</h2>
        <QuickActions />
      </div>
    </div>
  );
}
