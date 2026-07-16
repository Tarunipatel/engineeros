"use client";

import { Command } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { formatDate } from "@/lib/date";
import { useEffect, useState } from "react";
import { useCommandPaletteStore } from "@/stores/command-palette-store";

export function Topbar() {
  const [date, setDate] = useState<string | null>(null);
  useEffect(() => setDate(formatDate(new Date(), "dddd, MMM D")), []);
  const setCommandPaletteOpen = useCommandPaletteStore((s) => s.setOpen);

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-6">
      <span className="text-sm text-muted-foreground">{date}</span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-accent/60 md:hidden"
        >
          <Command className="h-3.5 w-3.5" />
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
}
