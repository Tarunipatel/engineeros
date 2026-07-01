import { db } from "../client";
import { roadmapDomains, roadmapSections, roadmapTopics } from "../schema";
import type { RoadmapDomainKey, RoadmapStatus } from "../schema";
import {
  SYSTEM_DESIGN_TOPICS,
  PYTHON_TOPICS,
  POSTGRESQL_TOPICS,
  CORE_CS_TOPICS,
  type RoadmapTopicSeed,
} from "./data/roadmaps.data";
import { addDays, today } from "../../lib/date";

const DOMAINS: { key: RoadmapDomainKey; label: string; topics: RoadmapTopicSeed[] }[] = [
  { key: "system_design", label: "System Design", topics: SYSTEM_DESIGN_TOPICS },
  { key: "python", label: "Python", topics: PYTHON_TOPICS },
  { key: "postgresql", label: "PostgreSQL", topics: POSTGRESQL_TOPICS },
  { key: "core_cs", label: "Core CS", topics: CORE_CS_TOPICS },
];

/** Earlier topics in the list are more likely completed, giving a realistic gradient. */
function statusFor(index: number, total: number): RoadmapStatus {
  const fraction = index / total;
  if (fraction < 0.4) return "completed";
  if (fraction < 0.65) return "in_progress";
  return "not_started";
}

export async function seedRoadmaps() {
  for (const domainDef of DOMAINS) {
    const [domain] = await db
      .insert(roadmapDomains)
      .values({ key: domainDef.key, label: domainDef.label })
      .returning();

    const sectionIdByName = new Map<string, number>();
    const sectionNames = Array.from(new Set(domainDef.topics.map((t) => t.section).filter(Boolean))) as string[];
    for (let i = 0; i < sectionNames.length; i++) {
      const [section] = await db
        .insert(roadmapSections)
        .values({ domainId: domain.id, name: sectionNames[i], sortOrder: i })
        .returning();
      sectionIdByName.set(sectionNames[i], section.id);
    }

    for (let i = 0; i < domainDef.topics.length; i++) {
      const t = domainDef.topics[i];
      const status = statusFor(i, domainDef.topics.length);
      await db.insert(roadmapTopics).values({
        domainId: domain.id,
        sectionId: t.section ? sectionIdByName.get(t.section) : null,
        title: t.title,
        difficulty: t.difficulty ?? null,
        estimatedMinutes: t.estimatedMinutes ?? null,
        status,
        notes: status === "completed" ? "Reviewed core concepts and worked through examples." : null,
        resources: t.resources ?? [],
        completedAt: status === "completed" ? addDays(today(), -(3 + i * 2)) : null,
        sortOrder: i,
      });
    }
  }
}
