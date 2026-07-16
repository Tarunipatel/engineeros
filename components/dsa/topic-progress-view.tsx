"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, Cell, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import type { TopicStat, DifficultyStat, CompanyStat } from "@/lib/stats";

const DIFFICULTY_BAR_COLORS: Record<string, string> = {
  Easy: "var(--accent-green)",
  Medium: "var(--accent-orange)",
  Hard: "var(--accent-pink)",
};

export function TopicProgressView({
  topicStats,
  difficultyStats,
  companyStats,
}: {
  topicStats: TopicStat[];
  difficultyStats: DifficultyStat[];
  companyStats: CompanyStat[];
}) {
  return (
    <div className="space-y-6">
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Progress by Topic</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {topicStats.map((t) => (
            <div key={t.topicId} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{t.topicName}</span>
                <span className="text-xs text-muted-foreground">
                  {t.solved} / {t.total}
                </span>
              </div>
              <Progress value={t.total > 0 ? (t.solved / t.total) * 100 : 0} className="h-1.5" />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-sm font-medium">By Difficulty</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={difficultyStats}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                <XAxis dataKey="difficulty" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="total" fill="var(--muted-foreground)" radius={[4, 4, 0, 0]} opacity={0.25} name="Total" />
                <Bar dataKey="solved" radius={[4, 4, 0, 0]} name="Solved">
                  {difficultyStats.map((d) => (
                    <Cell key={d.difficulty} fill={DIFFICULTY_BAR_COLORS[d.difficulty] ?? "var(--primary)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Top Companies</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={companyStats.slice(0, 8)} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis dataKey="company" type="category" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={80} />
                <Tooltip
                  contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="count" fill="var(--accent-blue)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
