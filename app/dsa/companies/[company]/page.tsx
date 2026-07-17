import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllProblems, getTopics } from "@/lib/queries/dsa";
import { ProblemsTable } from "@/components/dsa/problems-table";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DsaCompanyPage({ params }: { params: Promise<{ company: string }> }) {
  const { company: encodedCompany } = await params;
  const company = decodeURIComponent(encodedCompany);

  const [allProblems, topics] = await Promise.all([getAllProblems(), getTopics()]);
  const problems = allProblems.filter((p) => p.companyTags.includes(company));

  if (problems.length === 0) notFound();

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-8">
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-2 text-muted-foreground">
          <Link href="/dsa/companies">
            <ArrowLeft className="h-3.5 w-3.5" /> All companies
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">{company}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {problems.length} most frequently asked {problems.length === 1 ? "problem" : "problems"}.
        </p>
      </div>
      <ProblemsTable problems={problems} topics={topics} />
    </div>
  );
}
