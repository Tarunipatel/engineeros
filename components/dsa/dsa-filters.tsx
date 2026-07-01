"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import type { Topic } from "./types";

export type DsaFilterState = {
  search: string;
  topicId: string;
  difficulty: string;
  status: string;
};

export function DsaFilters({
  filters,
  onChange,
  topics,
}: {
  filters: DsaFilterState;
  onChange: (filters: DsaFilterState) => void;
  topics: Topic[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search problems..."
          className="pl-8"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
        />
      </div>
      <Select value={filters.topicId} onValueChange={(v) => onChange({ ...filters, topicId: v })}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Topic" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Topics</SelectItem>
          {topics.map((t) => (
            <SelectItem key={t.id} value={String(t.id)}>
              {t.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={filters.difficulty} onValueChange={(v) => onChange({ ...filters, difficulty: v })}>
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Difficulty" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Difficulty</SelectItem>
          <SelectItem value="Easy">Easy</SelectItem>
          <SelectItem value="Medium">Medium</SelectItem>
          <SelectItem value="Hard">Hard</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filters.status} onValueChange={(v) => onChange({ ...filters, status: v })}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="not_started">Not Started</SelectItem>
          <SelectItem value="attempted">Attempted</SelectItem>
          <SelectItem value="solved">Solved</SelectItem>
          <SelectItem value="mastered">Mastered</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
