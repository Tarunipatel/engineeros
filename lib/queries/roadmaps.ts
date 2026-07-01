import { db } from "@/db/client";
import { roadmapDomains, roadmapSections, roadmapTopics } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import type { RoadmapDomainKey } from "@/db/schema";

export async function getRoadmapByDomain(key: RoadmapDomainKey) {
  const domain = await db.query.roadmapDomains.findFirst({ where: eq(roadmapDomains.key, key) });
  if (!domain) return { domain: null, sections: [], topics: [] };

  const [sections, topics] = await Promise.all([
    db.select().from(roadmapSections).where(eq(roadmapSections.domainId, domain.id)).orderBy(asc(roadmapSections.sortOrder)),
    db.select().from(roadmapTopics).where(eq(roadmapTopics.domainId, domain.id)).orderBy(asc(roadmapTopics.sortOrder)),
  ]);

  return { domain, sections, topics };
}

export function computeProgress(topics: { status: string }[]) {
  if (topics.length === 0) return 0;
  const done = topics.filter((t) => t.status === "completed").length;
  return Math.round((done / topics.length) * 100);
}
