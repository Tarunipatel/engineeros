"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { updateTopicNotes } from "@/app/roadmaps/actions";
import type { Resource } from "@/db/schema";

export function TopicDetailDialog({
  open,
  onOpenChange,
  topic,
  path,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topic: { id: number; title: string; notes: string | null; resources: Resource[]; difficulty: string | null } | null;
  path: string;
}) {
  const router = useRouter();
  const [notes, setNotes] = useState(topic?.notes ?? "");

  if (!topic) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (o) setNotes(topic.notes ?? "");
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{topic.title}</DialogTitle>
          <DialogDescription>
            {topic.difficulty && <Badge variant="outline">{topic.difficulty}</Badge>}
          </DialogDescription>
        </DialogHeader>

        {topic.resources.length > 0 && (
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Resources</Label>
            {topic.resources.map((r) => (
              <a
                key={r.url}
                href={r.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-sm text-primary hover:underline"
              >
                <ExternalLink className="h-3 w-3" /> {r.label}
              </a>
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Notes</Label>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={5} />
        </div>

        <DialogFooter>
          <Button
            size="sm"
            onClick={async () => {
              await updateTopicNotes(topic.id, notes, path);
              onOpenChange(false);
              router.refresh();
            }}
          >
            Save notes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
