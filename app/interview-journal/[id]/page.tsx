import { getInterviewJournalEntry } from "@/lib/queries/journals";
import { InterviewDetailView } from "@/components/journals/interview-detail-view";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function InterviewJournalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const entry = await getInterviewJournalEntry(Number(id));
  if (!entry) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <InterviewDetailView entry={entry} />
    </div>
  );
}
