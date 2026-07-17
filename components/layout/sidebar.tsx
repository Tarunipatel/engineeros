"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCommandPaletteStore } from "@/stores/command-palette-store";
import { useTimerStore } from "@/stores/timer-store";
import { CATEGORY_LABELS, formatElapsed } from "@/components/today/timer-format";
import { logout } from "@/app/login/actions";
import { LogoMark } from "@/components/brand/logo-mark";
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
  LogOut,
} from "lucide-react";

// Tailwind statically scans for literal class names, so dynamically building
// classes like `bg-${color}/10` at runtime would never get generated — every
// combination used below has to appear as a complete literal string somewhere.
const COLOR_CLASSES = {
  "accent-blue": { text: "text-accent-blue", bg: "bg-accent-blue", bgSoft: "bg-accent-blue/10" },
  "accent-orange": { text: "text-accent-orange", bg: "bg-accent-orange", bgSoft: "bg-accent-orange/10" },
  "accent-purple": { text: "text-accent-purple", bg: "bg-accent-purple", bgSoft: "bg-accent-purple/10" },
  "accent-green": { text: "text-accent-green", bg: "bg-accent-green", bgSoft: "bg-accent-green/10" },
  "accent-cyan": { text: "text-accent-cyan", bg: "bg-accent-cyan", bgSoft: "bg-accent-cyan/10" },
  "accent-pink": { text: "text-accent-pink", bg: "bg-accent-pink", bgSoft: "bg-accent-pink/10" },
  "accent-yellow": { text: "text-accent-yellow", bg: "bg-accent-yellow", bgSoft: "bg-accent-yellow/10" },
  primary: { text: "text-primary", bg: "bg-primary", bgSoft: "bg-primary/10" },
  "muted-foreground": { text: "text-muted-foreground", bg: "bg-muted-foreground", bgSoft: "bg-muted-foreground/10" },
} as const;

type NavColor = keyof typeof COLOR_CLASSES;

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { href: "/", label: "Dashboard", icon: LayoutDashboard, color: "accent-blue" as NavColor },
      { href: "/today", label: "Today's Plan", icon: CalendarCheck, color: "accent-orange" as NavColor },
    ],
  },
  {
    label: "Prep",
    items: [
      { href: "/dsa", label: "DSA", icon: Code2, color: "primary" as NavColor },
      { href: "/system-design", label: "System Design", icon: Network, color: "accent-purple" as NavColor },
      { href: "/python", label: "Python", icon: FileCode2, color: "accent-green" as NavColor },
      { href: "/postgresql", label: "PostgreSQL", icon: Database, color: "accent-cyan" as NavColor },
      { href: "/core-cs", label: "Core CS", icon: BrainCircuit, color: "accent-orange" as NavColor },
    ],
  },
  {
    label: "Career",
    items: [
      { href: "/applications", label: "Applications", icon: Briefcase, color: "accent-blue" as NavColor },
      { href: "/interview-journal", label: "Interview Journal", icon: MessageSquareText, color: "accent-pink" as NavColor },
      { href: "/work-journal", label: "Work Journal", icon: NotebookPen, color: "accent-yellow" as NavColor },
    ],
  },
  {
    label: "Reviews",
    items: [{ href: "/weekly-reviews", label: "Weekly Reviews", icon: BarChart3, color: "accent-purple" as NavColor }],
  },
];

const SETTINGS_ITEM = { href: "/settings", label: "Settings", icon: Settings, color: "muted-foreground" as NavColor };

export function Sidebar() {
  const pathname = usePathname();
  const setCommandPaletteOpen = useCommandPaletteStore((s) => s.setOpen);
  const { running, elapsedSeconds, category } = useTimerStore();

  const renderItem = (item: (typeof NAV_GROUPS)[number]["items"][number]) => {
    const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
    const Icon = item.icon;
    const colors = COLOR_CLASSES[item.color];
    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          "group relative flex items-center gap-2.5 rounded-lg py-1.5 pr-2.5 pl-3 text-sm transition-all duration-150",
          active ? cn(colors.bgSoft, "font-medium text-foreground") : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
        )}
      >
        <span
          className={cn(
            "absolute top-1/2 left-0 h-4 w-[3px] -translate-y-1/2 rounded-full transition-all duration-150",
            active ? cn(colors.bg, "opacity-100") : "opacity-0"
          )}
        />
        <Icon
          className={cn(
            "h-4 w-4 shrink-0 transition-opacity duration-150",
            colors.text,
            active ? "opacity-100" : "opacity-60 group-hover:opacity-100"
          )}
          strokeWidth={1.75}
        />
        <span className="truncate">{item.label}</span>
      </Link>
    );
  };

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-border bg-background">
      <div className="flex h-14 items-center gap-2 px-5">
        <LogoMark className="h-6 w-6" textClassName="text-xs" />
        <span className="text-sm font-semibold tracking-tight">EngineerOS</span>
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-3">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="space-y-0.5">
            <p className="px-3 pb-1 text-[10px] font-semibold tracking-wider text-muted-foreground/60 uppercase">
              {group.label}
            </p>
            {group.items.map(renderItem)}
          </div>
        ))}

        <div className="space-y-0.5 border-t border-border pt-3">{renderItem(SETTINGS_ITEM)}</div>
      </nav>

      <div className="px-3 pb-4 pt-2 space-y-2">
        {running && (
          <Link
            href="/today"
            className="flex items-center justify-between rounded-lg border border-primary/30 bg-primary/10 px-2.5 py-1.5 text-xs text-primary shadow-sm"
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
          className="flex w-full items-center justify-between rounded-lg border border-border px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent/60"
        >
          <span className="flex items-center gap-2">
            <Command className="h-3.5 w-3.5" />
            Quick actions
          </span>
          <kbd className="rounded border border-border bg-muted px-1 py-0.5 text-[10px]">⌘K</kbd>
        </button>
        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
