import { getAllWeeklyReviews, getWeeklyReviewByWeekStart } from "@/lib/queries/weekly-review";
import { weekRange, formatDate } from "@/lib/date";
import { Card, CardContent } from "@/components/ui/card";
import { GenerateReviewButton } from "@/components/weekly-review/generate-review-button";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function WeeklyReviewsPage() {
  const [reviews, currentWeek] = await Promise.all([getAllWeeklyReviews(), getWeeklyReviewByWeekStart(weekRange().start)]);

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-6 py-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Weekly Reviews</h1>
          <p className="mt-1 text-sm text-muted-foreground">Reflect on progress every week.</p>
        </div>
        <GenerateReviewButton label={currentWeek ? "Refresh this week" : "Generate this week"} />
      </div>

      <div className="space-y-2">
        {reviews.map((r) => (
          <Link key={r.id} href={`/weekly-reviews/${r.weekStartDate}`}>
            <Card className="border-border/60 transition-colors hover:bg-accent/30">
              <CardContent className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="font-medium">
                    {formatDate(r.weekStartDate, "MMM D")} – {formatDate(r.weekEndDate, "MMM D")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {r.hoursStudied}h studied · {r.problemsSolved} problems · {r.applicationsSubmitted} applications
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
        {reviews.length === 0 && <p className="py-10 text-center text-sm text-muted-foreground">No reviews yet.</p>}
      </div>
    </div>
  );
}
