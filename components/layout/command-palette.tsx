"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCommandPaletteStore } from "@/stores/command-palette-store";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
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
  Plus,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/today", label: "Today's Plan", icon: CalendarCheck },
  { href: "/dsa", label: "DSA Tracker", icon: Code2 },
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

const QUICK_ACTIONS = [
  { href: "/dsa?new=1", label: "Log a new DSA problem" },
  { href: "/work-journal?new=1", label: "Log a work journal entry" },
  { href: "/applications?new=1", label: "Add a new application" },
  { href: "/today", label: "Start today's study timer" },
];

export function CommandPalette() {
  const { open, setOpen, toggle } = useCommandPaletteStore();
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [toggle]);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen} title="Quick actions" description="Jump anywhere or take a quick action">
      <Command>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Quick Actions">
            {QUICK_ACTIONS.map((action) => (
              <CommandItem key={action.href} onSelect={() => go(action.href)}>
                <Plus className="h-4 w-4" />
                {action.label}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Navigate">
            {NAV_ITEMS.map((item) => (
              <CommandItem key={item.href} onSelect={() => go(item.href)}>
                <item.icon className="h-4 w-4" />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
