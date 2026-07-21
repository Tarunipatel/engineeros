import { seedDsa } from "./seed-dsa";
import { seedRoadmaps } from "./seed-roadmaps";
import { seedSettings } from "./seed-settings";

/**
 * Seeds a clean personal copy of the shared catalog (DSA problems + company
 * data, roadmap topics, default settings) for a real new signup — no
 * fabricated demo progress, applications, or journal history like the
 * bootstrap seed uses.
 */
export async function seedNewUserCatalog(userId: number) {
  await seedDsa(userId, false);
  await seedRoadmaps(userId, false);
  await seedSettings(userId);
}
