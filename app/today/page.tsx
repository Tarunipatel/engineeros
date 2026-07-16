import { getTodayPlanWithDetails, getExistingDayPlanWithDetails, getDayActivitySummary } from "@/lib/queries/today";
import { TodayPlanView } from "@/components/today/today-plan-view";
import { DayHistoryView } from "@/components/today/day-history-view";
import { DayNav } from "@/components/today/day-nav";
import { StudyTimer } from "@/components/today/study-timer";
import { formatDate, today as todayDate } from "@/lib/date";

export const dynamic = "force-dynamic";

export default async function TodayPage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const { date: requestedDate } = await searchParams;
  const date = requestedDate ?? todayDate();
  const isToday = date === todayDate();

  const header = (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{isToday ? "Today's Plan" : "Day Summary"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{formatDate(date, "dddd, MMMM D")}</p>
      </div>
      <DayNav date={date} />
    </div>
  );

  if (isToday) {
    const { plan, planProblems, systemDesignTopic, pythonTopic, postgresqlTopic, coreCsTopic } =
      await getTodayPlanWithDetails();

    return (
      <div className="mx-auto max-w-6xl space-y-6 px-6 py-8">
        {header}
        <TodayPlanView
          planId={plan.id}
          planProblems={planProblems.map((p) => ({ ...p, kind: p.kind }))}
          systemDesignTopic={systemDesignTopic ?? null}
          pythonTopic={pythonTopic ?? null}
          postgresqlTopic={postgresqlTopic ?? null}
          coreCsTopic={coreCsTopic ?? null}
          workReflection={plan.workReflection}
          endOfDayReflection={plan.endOfDayReflection}
          notes={plan.notes}
          timerSlot={<StudyTimer />}
        />
      </div>
    );
  }

  const [existing, activity] = await Promise.all([getExistingDayPlanWithDetails(date), getDayActivitySummary(date)]);

  if (!existing && activity.sessions.length === 0 && activity.attempts.length === 0) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 px-6 py-8">
        {header}
        <p className="py-16 text-center text-sm text-muted-foreground">
          No activity recorded for {formatDate(date, "MMMM D")}.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-8">
      {header}
      <DayHistoryView
        planProblems={existing?.planProblems.map((p) => ({ ...p, kind: p.kind })) ?? []}
        systemDesignTopic={existing?.systemDesignTopic ?? null}
        pythonTopic={existing?.pythonTopic ?? null}
        postgresqlTopic={existing?.postgresqlTopic ?? null}
        coreCsTopic={existing?.coreCsTopic ?? null}
        workReflection={existing?.plan.workReflection ?? null}
        endOfDayReflection={existing?.plan.endOfDayReflection ?? null}
        notes={existing?.plan.notes ?? null}
        sessions={activity.sessions}
        attempts={activity.attempts}
        totalMinutes={activity.totalMinutes}
      />
    </div>
  );
}
