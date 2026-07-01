import { getAllProblems, getTopics } from "@/lib/queries/dsa";
import { ProblemsKanban } from "@/components/dsa/problems-kanban";
import { DsaNavTabs } from "@/components/dsa/dsa-nav-tabs";

export const dynamic = "force-dynamic";

export default async function DsaKanbanPage() {
  const [problems, topics] = await Promise.all([getAllProblems(), getTopics()]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">DSA Tracker</h1>
        <p className="mt-1 text-sm text-muted-foreground">Drag problems between topics.</p>
      </div>
      <DsaNavTabs />
      <ProblemsKanban problems={problems} topics={topics} />
    </div>
  );
}
