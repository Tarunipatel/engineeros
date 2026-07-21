import { getRoadmapByDomain } from "@/lib/queries/roadmaps";
import { RoadmapList } from "@/components/roadmaps/roadmap-list";
import { requireAuthenticatedUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function PostgresqlPage() {
  const user = await requireAuthenticatedUser();
  const { sections, topics } = await getRoadmapByDomain(user.id, "postgresql");

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">PostgreSQL</h1>
        <p className="mt-1 text-sm text-muted-foreground">Query planning, transactions, and scaling fundamentals.</p>
      </div>
      <RoadmapList domainLabel="PostgreSQL" sections={sections} topics={topics} path="/postgresql" accent="bg-accent-cyan" />
    </div>
  );
}
