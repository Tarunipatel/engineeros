"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCommandPaletteStore } from "@/stores/command-palette-store";
import { useTimerStore } from "@/stores/timer-store";
import { CATEGORY_LABELS, formatElapsed } from "@/components/today/timer-format";
import {
  LayoutDashboard,
  CalendarCheck,
  Code2,
  Network,
  FileCode2,
  Database,
  BrainCircuit,
  Briefcase,
  MessageSquareText,
  NotebookPen,
  BarChart3,
  Settings,
  Command,
  Timer,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/today", label: "Today's Plan", icon: CalendarCheck },
  { href: "/dsa", label: "DSA", icon: Code2 },
  { href: "/system-design", label: "System Design", icon: Network },
  { href: "/python", label: "Python", icon: FileCode2 },
  { href: "/postgresql", label: "PostgreSQL", icon: Database },
  { href: "/core-cs", label: "Core CS", icon: BrainCircuit },
  { href: "/applications", label: "Applications", icon: Briefcase },
  { href: "/interview-journal", label: "Interview Journal", icon: MessageSquareText },
  { href: "/work-journal", label: "Work Journal", icon: NotebookPen },
  { href: "/weekly-reviews", label: "Weekly Reviews", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const setCommandPaletteOpen = useCommandPaletteStore((s) => s.setOpen);
  const { running, elapsedSeconds, category } = useTimerStore();

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-border bg-background">
      <div className="flex h-14 items-center gap-2 px-5">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-semibold">
          E
        </div>
        <span className="text-sm font-semibold tracking-tight">EngineerOS</span>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-2">
        {NAV_ITEMS.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
                active
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-4 pt-2 space-y-2">
        {running && (
          <Link
            href="/today"
            className="flex items-center justify-between rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1.5 text-xs text-primary"
          >
            <span className="flex items-center gap-2">
              <Timer className="h-3.5 w-3.5 animate-pulse" />
              {CATEGORY_LABELS[category]}
            </span>
            <span className="tabular-nums font-medium">{formatElapsed(elapsedSeconds)}</span>
          </Link>
        )}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex w-full items-center justify-between rounded-md border border-border px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-accent/60"
        >
          <span className="flex items-center gap-2">
            <Command className="h-3.5 w-3.5" />
            Quick actions
          </span>
          <kbd className="rounded border border-border bg-muted px-1 py-0.5 text-[10px]">⌘K</kbd>
        </button>
      </div>
    </aside>
  );
}
