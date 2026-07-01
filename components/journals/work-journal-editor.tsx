"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createWorkJournalEntry } from "@/app/work-journal/actions";
import type { WorkJournalType } from "@/db/schema";
import { WORK_JOURNAL_TYPE_LABELS } from "./work-journal-types";

export function WorkJournalEditor({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter();
  const [form, setForm] = useState({
    type: "feature_built" as WorkJournalType,
    title: "",
    content: "",
    tags: "",
  });

  const save = async () => {
    await createWorkJournalEntry({
      type: form.type,
      title: form.title,
      content: form.content,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    });
    setForm({ type: "feature_built", title: "", content: "", tags: "" });
    onOpenChange(false);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Log a Work Entry</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Type</Label>
            <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as WorkJournalType })}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(WORK_JOURNAL_TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Title</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Details</Label>
            <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={5} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Tags (comma separated)</Label>
            <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button size="sm" onClick={save} disabled={!form.title || !form.content}>
            Save entry
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
