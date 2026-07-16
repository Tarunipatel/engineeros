import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  sublabel,
  icon: Icon,
  className,
  accent = "text-foreground/80 bg-accent",
}: {
  label: string;
  value: string;
  sublabel?: string;
  icon: LucideIcon;
  className?: string;
  accent?: string;
}) {
  return (
    <Card className={cn("border-border/60", className)}>
      <CardContent className="flex items-center gap-4 px-5 py-4">
        <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", accent)}>
          <Icon className="h-4.5 w-4.5" strokeWidth={1.75} />
        </div>
        <div className="min-w-0">
          <p className="text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
          <p className="text-xs text-muted-foreground truncate">
            {label}
            {sublabel && <span className="ml-1 text-muted-foreground/70">· {sublabel}</span>}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
