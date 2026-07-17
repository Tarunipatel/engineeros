import Link from "next/link";
import { getCompanyStats } from "@/lib/stats";
import { DsaNavTabs } from "@/components/dsa/dsa-nav-tabs";
import { Card } from "@/components/ui/card";
import { Building2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DsaCompaniesPage() {
  const companies = await getCompanyStats();

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">DSA Tracker</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Most frequently asked problems, grouped by company.
        </p>
      </div>
      <DsaNavTabs />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {companies.map((c) => (
          <Link key={c.company} href={`/dsa/companies/${encodeURIComponent(c.company)}`}>
            <Card interactive className="flex items-center gap-3 p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-blue/10 text-accent-blue">
                <Building2 className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{c.company}</p>
                <p className="text-xs text-muted-foreground">
                  {c.count} {c.count === 1 ? "problem" : "problems"}
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
