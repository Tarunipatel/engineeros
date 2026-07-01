"use client";

import { useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Star, ArrowUpDown, ExternalLink } from "lucide-react";
import { DsaFilters, type DsaFilterState } from "./dsa-filters";
import { ProblemDetailSheet } from "./problem-detail-sheet";
import { STATUS_LABELS, DIFFICULTY_COLORS, type ProblemWithRelations, type Topic } from "./types";
import { toggleFavorite } from "@/app/dsa/actions";
import { formatDate, isOverdue, isToday } from "@/lib/date";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

type SortKey = "title" | "difficulty" | "topic" | "nextRevisionDate" | "status";

const DIFFICULTY_RANK = { Easy: 0, Medium: 1, Hard: 2 };

export function ProblemsTable({ problems, topics }: { problems: ProblemWithRelations[]; topics: Topic[] }) {
  const router = useRouter();
  const [filters, setFilters] = useState<DsaFilterState>({ search: "", topicId: "all", difficulty: "all", status: "all" });
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "topic", dir: 1 });
  const [openId, setOpenId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    let rows = problems;
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      rows = rows.filter((p) => p.title.toLowerCase().includes(q));
    }
    if (filters.topicId !== "all") rows = rows.filter((p) => p.topicId === Number(filters.topicId));
    if (filters.difficulty !== "all") rows = rows.filter((p) => p.difficulty === filters.difficulty);
    if (filters.status !== "all") rows = rows.filter((p) => p.status === filters.status);

    const sorted = [...rows].sort((a, b) => {
      let cmp = 0;
      if (sort.key === "title") cmp = a.title.localeCompare(b.title);
      else if (sort.key === "difficulty") cmp = DIFFICULTY_RANK[a.difficulty] - DIFFICULTY_RANK[b.difficulty];
      else if (sort.key === "topic") cmp = (a.topic?.name ?? "").localeCompare(b.topic?.name ?? "");
      else if (sort.key === "status") cmp = a.status.localeCompare(b.status);
      else if (sort.key === "nextRevisionDate") cmp = (a.nextRevisionDate ?? "9999").localeCompare(b.nextRevisionDate ?? "9999");
      return cmp * sort.dir;
    });
    return sorted;
  }, [problems, filters, sort]);

  const toggleSort = (key: SortKey) => {
    setSort((prev) => (prev.key === key ? { key, dir: prev.dir === 1 ? -1 : 1 } : { key, dir: 1 }));
  };

  const SortHeader = ({ label, sortKey }: { label: string; sortKey: SortKey }) => (
    <button
      onClick={() => toggleSort(sortKey)}
      className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
    >
      {label}
      <ArrowUpDown className="h-3 w-3" />
    </button>
  );

  return (
    <div className="space-y-3">
      <DsaFilters filters={filters} onChange={setFilters} topics={topics} />

      <div className="rounded-xl border border-border/60">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8" />
              <TableHead>
                <SortHeader label="Title" sortKey="title" />
              </TableHead>
              <TableHead>
                <SortHeader label="Topic" sortKey="topic" />
              </TableHead>
              <TableHead>
                <SortHeader label="Difficulty" sortKey="difficulty" />
              </TableHead>
              <TableHead>
                <SortHeader label="Status" sortKey="status" />
              </TableHead>
              <TableHead>
                <SortHeader label="Next Revision" sortKey="nextRevisionDate" />
              </TableHead>
              <TableHead className="w-8" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => {
              const overdue = p.nextRevisionDate ? isOverdue(p.nextRevisionDate) : false;
              const dueToday = p.nextRevisionDate ? isToday(p.nextRevisionDate) : false;
              return (
                <TableRow
                  key={p.id}
                  className="cursor-pointer"
                  onClick={() => setOpenId(p.id)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={async () => {
                        await toggleFavorite(p.id, !p.favorite);
                        router.refresh();
                      }}
                    >
                      <Star className={cn("h-3.5 w-3.5 text-muted-foreground", p.favorite && "fill-amber-400 text-amber-400")} />
                    </button>
                  </TableCell>
                  <TableCell className="font-medium">{p.title}</TableCell>
                  <TableCell className="text-muted-foreground">{p.topic?.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={DIFFICULTY_COLORS[p.difficulty]}>
                      {p.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{STATUS_LABELS[p.status]}</Badge>
                  </TableCell>
                  <TableCell>
                    {p.nextRevisionDate ? (
                      <span className={cn("text-xs", overdue && "text-destructive", dueToday && "text-primary")}>
                        {formatDate(p.nextRevisionDate, "MMM D")}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    {p.url && (
                      <a href={p.url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                  No problems match these filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-xs text-muted-foreground">
        {filtered.length} of {problems.length} problems
      </p>

      <ProblemDetailSheet problemId={openId} open={openId != null} onOpenChange={(o) => !o && setOpenId(null)} />
    </div>
  );
}
