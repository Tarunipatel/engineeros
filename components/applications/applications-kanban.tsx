"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DndContext, useDraggable, useDroppable, type DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Building2 } from "lucide-react";
import { updateApplicationStage } from "@/app/applications/actions";
import { ApplicationCardDialog, type ApplicationRow } from "./application-card-dialog";
import { formatDate } from "@/lib/date";
import { cn } from "@/lib/utils";
import type { ApplicationStage } from "@/db/schema";

const STAGES: { key: ApplicationStage; label: string; dot: string }[] = [
  { key: "wishlist", label: "Wishlist", dot: "bg-muted-foreground" },
  { key: "applied", label: "Applied", dot: "bg-accent-blue" },
  { key: "online_assessment", label: "Online Assessment", dot: "bg-accent-cyan" },
  { key: "interview", label: "Interview", dot: "bg-accent-purple" },
  { key: "offer", label: "Offer", dot: "bg-accent-green" },
  { key: "rejected", label: "Rejected", dot: "bg-destructive" },
];

function Card({ app, onOpen }: { app: ApplicationRow; onOpen: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: app.id });
  const style = transform ? { transform: `translate(${transform.x}px, ${transform.y}px)` } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onOpen}
      className={cn(
        "cursor-grab space-y-1.5 rounded-lg border border-border/60 bg-card p-2.5 text-sm shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md active:cursor-grabbing",
        isDragging && "scale-105 opacity-90 shadow-lifted"
      )}
    >
      <div className="flex items-center gap-1.5 font-medium">
        <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
        {app.company}
      </div>
      <p className="text-xs text-muted-foreground">{app.role}</p>
      <div className="flex flex-wrap items-center gap-1.5">
        {app.referral && (
          <Badge variant="outline" className="text-[10px]">
            Referral
          </Badge>
        )}
        {app.appliedDate && <span className="text-[10px] text-muted-foreground">{formatDate(app.appliedDate, "MMM D")}</span>}
      </div>
    </div>
  );
}

function StageColumn({
  stage,
  apps,
  onOpen,
}: {
  stage: { key: ApplicationStage; label: string; dot: string };
  apps: ApplicationRow[];
  onOpen: (app: ApplicationRow) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.key });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex w-64 shrink-0 flex-col rounded-xl border border-border/60 bg-muted/30 p-2.5 transition-all duration-150",
        isOver && "ring-2 ring-primary/50 bg-primary/5"
      )}
    >
      <div className="mb-2 flex items-center justify-between px-1">
        <h3 className="flex items-center gap-1.5 text-sm font-medium">
          <span className={cn("h-1.5 w-1.5 rounded-full", stage.dot)} />
          {stage.label}
        </h3>
        <span className="text-xs text-muted-foreground">{apps.length}</span>
      </div>
      <div className="flex-1 space-y-2">
        {apps.map((a) => (
          <Card key={a.id} app={a} onOpen={() => onOpen(a)} />
        ))}
      </div>
    </div>
  );
}

export function ApplicationsKanban({ applications }: { applications: ApplicationRow[] }) {
  const router = useRouter();
  const [openApp, setOpenApp] = useState<ApplicationRow | null>(null);
  const [creating, setCreating] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const id = Number(active.id);
    const newStage = over.id as ApplicationStage;
    const app = applications.find((a) => a.id === id);
    if (!app || app.stage === newStage) return;
    await updateApplicationStage(id, newStage);
    router.refresh();
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setCreating(true)}>
          <Plus className="h-3.5 w-3.5" /> New application
        </Button>
      </div>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="flex gap-3 overflow-x-auto pb-4">
          {STAGES.map((stage) => (
            <StageColumn
              key={stage.key}
              stage={stage}
              apps={applications.filter((a) => a.stage === stage.key)}
              onOpen={setOpenApp}
            />
          ))}
        </div>
      </DndContext>
      <ApplicationCardDialog open={openApp != null} onOpenChange={(o) => !o && setOpenApp(null)} application={openApp} />
      <ApplicationCardDialog open={creating} onOpenChange={setCreating} application={null} />
    </div>
  );
}
