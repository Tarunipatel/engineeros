import { getRoadmapByDomain } from "@/lib/queries/roadmaps";
import { RoadmapList } from "@/components/roadmaps/roadmap-list";
import { requireAuthenticatedUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function CoreCsPage() {
  const user = await requireAuthenticatedUser();
  const { sections, topics } = await getRoadmapByDomain(user.id, "core_cs");

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Core CS</h1>
        <p className="mt-1 text-sm text-muted-foreground">Operating Systems, Networking, DBMS, and OOP fundamentals.</p>
      </div>
      <RoadmapList domainLabel="Core CS" sections={sections} topics={topics} path="/core-cs" accent="bg-accent-orange" />
    </div>
  );
}
