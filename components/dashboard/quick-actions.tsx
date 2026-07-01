"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, NotebookPen, Briefcase, Timer } from "lucide-react";

export function QuickActions() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button asChild size="sm" variant="secondary">
        <Link href="/dsa">
          <Plus className="h-3.5 w-3.5" /> Log DSA problem
        </Link>
      </Button>
      <Button asChild size="sm" variant="secondary">
        <Link href="/work-journal">
          <NotebookPen className="h-3.5 w-3.5" /> Log work entry
        </Link>
      </Button>
      <Button asChild size="sm" variant="secondary">
        <Link href="/applications">
          <Briefcase className="h-3.5 w-3.5" /> Add application
        </Link>
      </Button>
      <Button asChild size="sm" variant="secondary">
        <Link href="/today">
          <Timer className="h-3.5 w-3.5" /> Start studying
        </Link>
      </Button>
    </div>
  );
}
