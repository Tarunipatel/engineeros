import { getRoadmapByDomain } from "@/lib/queries/roadmaps";
import { RoadmapList } from "@/components/roadmaps/roadmap-list";

export const dynamic = "force-dynamic";

export default async function SystemDesignPage() {
  const { sections, topics } = await getRoadmapByDomain("system_design");

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">System Design</h1>
        <p className="mt-1 text-sm text-muted-foreground">Roadmap of core system design concepts.</p>
      </div>
      <RoadmapList domainLabel="System Design" sections={sections} topics={topics} path="/system-design" />
    </div>
  );
}
