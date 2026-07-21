import { getWeeklyReviewByWeekStart } from "@/lib/queries/weekly-review";
import { WeeklyReviewDetail } from "@/components/weekly-review/weekly-review-detail";
import { formatDate } from "@/lib/date";
import { notFound } from "next/navigation";
import { requireAuthenticatedUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function WeeklyReviewDetailPage({ params }: { params: Promise<{ weekStartDate: string }> }) {
  const { weekStartDate } = await params;
  const user = await requireAuthenticatedUser();
  const review = await getWeeklyReviewByWeekStart(user.id, weekStartDate);
  if (!review) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Week of {formatDate(review.weekStartDate, "MMM D")} – {formatDate(review.weekEndDate, "MMM D")}
        </h1>
      </div>
      <WeeklyReviewDetail review={review} />
    </div>
  );
}
