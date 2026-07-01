import { getWorkJournalEntries } from "@/lib/queries/journals";
import { WorkJournalList } from "@/components/journals/work-journal-list";

export const dynamic = "force-dynamic";

export default async function WorkJournalPage() {
  const entries = await getWorkJournalEntries();

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Work Journal</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your searchable engineering diary — {entries.length} entries.</p>
      </div>
      <WorkJournalList entries={entries} />
    </div>
  );
}
