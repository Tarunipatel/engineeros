import { getTodayPlanWithDetails } from "@/lib/queries/today";
import { TodayPlanView } from "@/components/today/today-plan-view";
import { StudyTimer } from "@/components/today/study-timer";
import { formatDate, today } from "@/lib/date";

export const dynamic = "force-dynamic";

export default async function TodayPage() {
  const { plan, planProblems, systemDesignTopic, pythonTopic, postgresqlTopic, coreCsTopic } =
    await getTodayPlanWithDetails();

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Today&apos;s Plan</h1>
        <p className="mt-1 text-sm text-muted-foreground">{formatDate(today(), "dddd, MMMM D")}</p>
      </div>

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
