"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { regenerateWeeklyReview } from "@/app/weekly-reviews/actions";

export function GenerateReviewButton({ weekStartDate, label }: { weekStartDate?: string; label: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <Button
      size="sm"
      variant="secondary"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        const review = await regenerateWeeklyReview(weekStartDate);
        setLoading(false);
        if (review) router.push(`/weekly-reviews/${review.weekStartDate}`);
        router.refresh();
      }}
    >
      <Sparkles className="h-3.5 w-3.5" /> {label}
    </Button>
  );
}
