"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { WorkJournalEditor } from "./work-journal-editor";
import { WORK_JOURNAL_TYPE_LABELS } from "./work-journal-types";
import { searchWorkJournalAction } from "@/app/work-journal/actions";
import { formatDate } from "@/lib/date";
import { cn } from "@/lib/utils";
import type { WorkJournalType } from "@/db/schema";

type Entry = { id: number; date: string; type: WorkJournalType; title: string; content: string; tags: string[] };

export function WorkJournalList({ entries }: { entries: Entry[] }) {
  const [creating, setCreating] = useState(false);
  const [typeFilter, setTypeFilter] = useState<WorkJournalType | "all">("all");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Entry[] | null>(null);

  const runSearch = async (q: string) => {
    setSearch(q);
    if (!q.trim()) {
      setSearchResults(null);
      return;
    }
    const results = await searchWorkJournalAction(q);
    setSearchResults(results as Entry[]);
  };

  const visible = useMemo(() => {
    const base = searchResults ?? entries;
    if (typeFilter === "all") return base;
    return base.filter((e) => e.type === typeFilter);
  }, [searchResults, entries, typeFilter]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search your engineering diary..." className="pl-8" value={search} onChange={(e) => runSearch(e.target.value)} />
        </div>
        <Button size="sm" onClick={() => setCreating(true)}>
          <Plus className="h-3.5 w-3.5" /> Log entry
        </Button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setTypeFilter("all")}
          className={cn(
            "rounded-full border px-2.5 py-1 text-xs",
            typeFilter === "all" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"
          )}
        >
          All
        </button>
        {Object.entries(WORK_JOURNAL_TYPE_LABELS).map(([value, label]) => (
          <button
            key={value}
            onClick={() => setTypeFilter(value as WorkJournalType)}
            className={cn(
              "rounded-full border px-2.5 py-1 text-xs",
              typeFilter === value ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {visible.map((e) => (
          <Card key={e.id} className="border-border/60">
            <CardContent className="space-y-1.5 p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-medium">{e.title}</h3>
                <span className="shrink-0 text-xs text-muted-foreground">{formatDate(e.date, "MMM D")}</span>
              </div>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{e.content}</p>
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <Badge variant="secondary" className="text-[10px]">
                  {WORK_JOURNAL_TYPE_LABELS[e.type]}
                </Badge>
                {e.tags.map((t) => (
                  <Badge key={t} variant="outline" className="text-[10px] text-muted-foreground">
                    {t}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
        {visible.length === 0 && <p className="py-10 text-center text-sm text-muted-foreground">No entries found.</p>}
      </div>

      <WorkJournalEditor open={creating} onOpenChange={setCreating} />
    </div>
  );
}
