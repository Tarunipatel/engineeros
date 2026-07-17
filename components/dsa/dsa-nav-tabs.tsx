"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/dsa", label: "Table" },
  { href: "/dsa/kanban", label: "Kanban" },
  { href: "/dsa/topics", label: "Topic Progress" },
  { href: "/dsa/companies", label: "Companies" },
];

export function DsaNavTabs() {
  const pathname = usePathname();
  return (
    <div className="flex gap-1 border-b border-border">
      {TABS.map((tab) => {
        const active = tab.href === "/dsa" ? pathname === "/dsa" : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "border-b-2 px-3 py-2 text-sm transition-colors",
              active
                ? "border-primary font-medium text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
