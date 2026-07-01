"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DndContext, useDraggable, useDroppable, type DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { updateProblemTopic } from "@/app/dsa/actions";
import { DIFFICULTY_COLORS, STATUS_LABELS, type ProblemWithRelations, type Topic } from "./types";
import { ProblemDetailSheet } from "./problem-detail-sheet";
import { cn } from "@/lib/utils";

function ProblemCard({ problem, onOpen }: { problem: ProblemWithRelations; onOpen: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: problem.id });
  const style = transform ? { transform: `translate(${transform.x}px, ${transform.y}px)` } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onOpen}
      className={cn(
        "cursor-grab space-y-1.5 rounded-lg border border-border/60 bg-card p-2.5 text-sm shadow-sm active:cursor-grabbing",
        isDragging && "opacity-50"
      )}
    >
      <div className="flex items-start justify-between gap-1.5">
        <span className="font-medium leading-snug">{problem.title}</span>
        {problem.favorite && <Star className="h-3 w-3 shrink-0 fill-amber-400 text-amber-400" />}
      </div>
      <div className="flex flex-wrap gap-1">
        <Badge variant="outline" className={cn("text-[10px]", DIFFICULTY_COLORS[problem.difficulty])}>
          {problem.difficulty}
        </Badge>
        <Badge variant="secondary" className="text-[10px]">
          {STATUS_LABELS[problem.status]}
        </Badge>
      </div>
    </div>
  );
}

function TopicColumn({
  topic,
  problems,
  onOpen,
}: {
  topic: Topic;
  problems: ProblemWithRelations[];
  onOpen: (id: number) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: topic.id });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex w-72 shrink-0 flex-col rounded-xl border border-border/60 bg-muted/30 p-2.5",
        isOver && "ring-2 ring-primary/40"
      )}
    >
      <div className="mb-2 flex items-center justify-between px-1">
        <h3 className="text-sm font-medium">{topic.name}</h3>
        <span className="text-xs text-muted-foreground">{problems.length}</span>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto">
        {problems.map((p) => (
          <ProblemCard key={p.id} problem={p} onOpen={() => onOpen(p.id)} />
        ))}
      </div>
    </div>
  );
}

export function ProblemsKanban({ problems, topics }: { problems: ProblemWithRelations[]; topics: Topic[] }) {
  const router = useRouter();
  const [openId, setOpenId] = useState<number | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const problemId = Number(active.id);
    const newTopicId = Number(over.id);
    const problem = problems.find((p) => p.id === problemId);
    if (!problem || problem.topicId === newTopicId) return;
    await updateProblemTopic(problemId, newTopicId);
    router.refresh();
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex gap-3 overflow-x-auto pb-4">
        {topics.map((topic) => (
          <TopicColumn
            key={topic.id}
            topic={topic}
            problems={problems.filter((p) => p.topicId === topic.id)}
            onOpen={setOpenId}
          />
        ))}
      </div>
      <ProblemDetailSheet problemId={openId} open={openId != null} onOpenChange={(o) => !o && setOpenId(null)} />
    </DndContext>
  );
}
