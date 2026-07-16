export const CATEGORY_LABELS: Record<string, string> = {
  dsa: "DSA",
  system_design: "System Design",
  python: "Python",
  postgresql: "PostgreSQL",
  core_cs: "Core CS",
  work_journal: "Work Journal",
  other: "Other",
};

export function formatElapsed(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}
