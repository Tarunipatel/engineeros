import { eq } from "drizzle-orm";
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

/**
 * Seeds a personal copy of every roadmap domain's topics for one user.
 * roadmap_domains/roadmap_sections are shared taxonomy, not per-user —
 * reused if they already exist so this is safe to call once per new user.
 * `withDemoProgress` fabricates a realistic completion gradient — used
 * only for the original bootstrap account; real new signups start with
 * everything not_started.
 */
export async function seedRoadmaps(userId: number, withDemoProgress: boolean) {
  for (const domainDef of DOMAINS) {
    let [domain] = await db.select().from(roadmapDomains).where(eq(roadmapDomains.key, domainDef.key)).limit(1);
    if (!domain) {
      [domain] = await db.insert(roadmapDomains).values({ key: domainDef.key, label: domainDef.label }).returning();
    }

    const existingSections = await db.select().from(roadmapSections).where(eq(roadmapSections.domainId, domain.id));
    const sectionIdByName = new Map(existingSections.map((s) => [s.name, s.id]));

    const sectionNames = Array.from(new Set(domainDef.topics.map((t) => t.section).filter(Boolean))) as string[];
    for (let i = 0; i < sectionNames.length; i++) {
      if (sectionIdByName.has(sectionNames[i])) continue;
      const [section] = await db
        .insert(roadmapSections)
        .values({ domainId: domain.id, name: sectionNames[i], sortOrder: existingSections.length + i })
        .returning();
      sectionIdByName.set(sectionNames[i], section.id);
    }

    for (let i = 0; i < domainDef.topics.length; i++) {
      const t = domainDef.topics[i];
      const status = withDemoProgress ? statusFor(i, domainDef.topics.length) : "not_started";
      await db.insert(roadmapTopics).values({
        userId,
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
