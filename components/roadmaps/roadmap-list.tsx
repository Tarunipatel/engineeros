"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { updateTopicStatus } from "@/app/roadmaps/actions";
import { TopicDetailDialog } from "./topic-detail-dialog";
import { cn } from "@/lib/utils";
import type { Resource, RoadmapStatus } from "@/db/schema";

type TopicRow = {
  id: number;
  title: string;
  status: RoadmapStatus;
  difficulty: string | null;
  estimatedMinutes: number | null;
  notes: string | null;
  resources: Resource[];
  sectionId: number | null;
};

type Section = { id: number; name: string };

export function RoadmapList({
  domainLabel,
  sections,
  topics,
  path,
  accent = "bg-primary",
}: {
  domainLabel: string;
  sections: Section[];
  topics: TopicRow[];
  path: string;
  accent?: string;
}) {
  const router = useRouter();
  const [openTopic, setOpenTopic] = useState<TopicRow | null>(null);

  const completed = topics.filter((t) => t.status === "completed").length;
  const pct = topics.length > 0 ? Math.round((completed / topics.length) * 100) : 0;

  const groups: { section: Section | null; topics: TopicRow[] }[] =
    sections.length > 0
      ? sections.map((s) => ({ section: s, topics: topics.filter((t) => t.sectionId === s.id) }))
      : [{ section: null, topics }];

  const handleToggle = async (topic: TopicRow, checked: boolean) => {
    await updateTopicStatus(topic.id, checked ? "completed" : "in_progress", path);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border/60 bg-card p-5">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-medium">{domainLabel} Progress</h2>
          <span className="text-sm text-muted-foreground">
            {completed} / {topics.length} · {pct}%
          </span>
        </div>
        <Progress value={pct} className="h-1.5" indicatorClassName={accent} />
      </div>

      {groups.map((group) => (
        <div key={group.section?.id ?? "flat"} className="space-y-1">
          {group.section && <h3 className="px-1 pb-1 text-sm font-medium text-muted-foreground">{group.section.name}</h3>}
          <div className="rounded-xl border border-border/60 divide-y divide-border/60">
            {group.topics.map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-3 px-4 py-3 hover:bg-accent/30 cursor-pointer"
                onClick={() => setOpenTopic(t)}
              >
                <div onClick={(e) => e.stopPropagation()}>
                  <Checkbox checked={t.status === "completed"} onCheckedChange={(c) => handleToggle(t, Boolean(c))} />
                </div>
                <span className={cn("flex-1 text-sm", t.status === "completed" && "text-muted-foreground line-through")}>
                  {t.title}
                </span>
                {t.status === "in_progress" && (
                  <Badge variant="outline" className="text-[10px]">
                    In progress
                  </Badge>
                )}
                {t.difficulty && (
                  <Badge variant="secondary" className="text-[10px]">
                    {t.difficulty}
                  </Badge>
                )}
                {t.estimatedMinutes && <span className="text-xs text-muted-foreground">{t.estimatedMinutes}m</span>}
              </div>
            ))}
          </div>
        </div>
      ))}

      <TopicDetailDialog open={openTopic != null} onOpenChange={(o) => !o && setOpenTopic(null)} topic={openTopic} path={path} />
    </div>
  );
}
