import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CalendarClock } from "lucide-react";
import { addDays, today } from "@/lib/date";

export function DayNav({ date }: { date: string }) {
  const isToday = date === today();
  const prev = addDays(date, -1);
  const next = addDays(date, 1);
  const canGoNext = next <= today();

  return (
    <div className="flex items-center gap-1">
      <Button asChild size="icon" variant="ghost" className="h-8 w-8">
        <Link href={`/today?date=${prev}`} aria-label="Previous day">
          <ChevronLeft className="h-4 w-4" />
        </Link>
      </Button>
      {canGoNext ? (
        <Button asChild size="icon" variant="ghost" className="h-8 w-8">
          <Link href={`/today?date=${next}`} aria-label="Next day">
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      ) : (
        <Button size="icon" variant="ghost" className="h-8 w-8" disabled>
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
      {!isToday && (
        <Button asChild size="sm" variant="secondary" className="ml-1">
          <Link href="/today">
            <CalendarClock className="h-3.5 w-3.5" /> Jump to today
          </Link>
        </Button>
      )}
    </div>
  );
}
