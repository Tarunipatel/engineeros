"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useUiStore } from "@/stores/ui-store";
import { StickyNote } from "lucide-react";

export function QuickNotes() {
  const { quickNotes, setQuickNotes } = useUiStore();

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <StickyNote className="h-4 w-4 text-muted-foreground" />
          Quick Notes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={quickNotes}
          onChange={(e) => setQuickNotes(e.target.value)}
          placeholder="Jot something down before it slips..."
          className="min-h-[100px] resize-none rounded-lg border-none bg-transparent px-0 shadow-none transition-shadow focus-visible:ring-2 focus-visible:ring-accent-yellow/40"
        />
      </CardContent>
    </Card>
  );
}
