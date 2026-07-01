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
import { Flame, Code2, Clock, Briefcase } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [dashboard, todayPlan] = await Promise.all([getDashboardData(), getTodayPlanWithDetails()]);
  const { start, end } = weekRange();

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{greeting()}.</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Week of {formatDate(start, "MMM D")} – {formatDate(end, "MMM D")}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Study Streak" value={`${dashboard.streak}d`} icon={Flame} />
        <StatCard label="Solved This Week" value={String(dashboard.problemsSolvedThisWeek)} icon={Code2} />
        <StatCard label="Study Hours" value={`${dashboard.weekHours}h`} sublabel="this week" icon={Clock} />
        <StatCard label="Applications" value={String(dashboard.applicationsThisWeek)} sublabel="this week" icon={Briefcase} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-border/60 bg-card p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-medium">Activity</h2>
              <span className="text-xs text-muted-foreground">Last 26 weeks</span>
            </div>
            <ActivityHeatmap data={dashboard.heatmap} />
          </div>

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
