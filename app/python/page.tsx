import { getRoadmapByDomain } from "@/lib/queries/roadmaps";
import { RoadmapList } from "@/components/roadmaps/roadmap-list";

export const dynamic = "force-dynamic";

export default async function PythonPage() {
  const { sections, topics } = await getRoadmapByDomain("python");

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Python</h1>
        <p className="mt-1 text-sm text-muted-foreground">Deepen the Python internals interviewers probe for.</p>
      </div>
      <RoadmapList domainLabel="Python" sections={sections} topics={topics} path="/python" />
    </div>
  );
}
