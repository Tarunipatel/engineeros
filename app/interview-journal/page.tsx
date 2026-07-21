import { getInterviewJournalEntries } from "@/lib/queries/journals";
import { InterviewJournalList } from "@/components/journals/interview-journal-list";
import { requireAuthenticatedUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function InterviewJournalPage() {
  const user = await requireAuthenticatedUser();
  const entries = await getInterviewJournalEntries(user.id);

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Interview Journal</h1>
        <p className="mt-1 text-sm text-muted-foreground">{entries.length} interviews logged.</p>
      </div>
      <InterviewJournalList entries={entries} />
    </div>
  );
}
