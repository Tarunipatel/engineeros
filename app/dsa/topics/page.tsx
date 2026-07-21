import { getTopicStats, getDifficultyStats, getCompanyStats } from "@/lib/stats";
import { TopicProgressView } from "@/components/dsa/topic-progress-view";
import { DsaNavTabs } from "@/components/dsa/dsa-nav-tabs";
import { requireAuthenticatedUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function DsaTopicsPage() {
  const user = await requireAuthenticatedUser();
  const [topicStats, difficultyStats, companyStats] = await Promise.all([
    getTopicStats(user.id),
    getDifficultyStats(user.id),
    getCompanyStats(user.id),
  ]);

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">DSA Tracker</h1>
        <p className="mt-1 text-sm text-muted-foreground">Topic, difficulty, and company breakdowns.</p>
      </div>
      <DsaNavTabs />
      <TopicProgressView topicStats={topicStats} difficultyStats={difficultyStats} companyStats={companyStats} />
    </div>
  );
}
