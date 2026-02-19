import { Suspense } from "react";
import Link from "next/link";
import { parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import WorkoutDatePicker from "./_components/WorkoutDatePicker";
import WorkoutList from "./_components/WorkoutList";
import WorkoutListSkeleton from "./_components/WorkoutListSkeleton";

type Props = {
  searchParams: Promise<{ date?: string }>;
};

export default async function DashboardPage({ searchParams }: Props) {
  const { date: dateParam } = await searchParams;
  const parsedDate = dateParam ? parseISO(dateParam) : new Date();
  const date = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground text-sm">
              View your workouts for a given day.
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/workout/new">Log new workout</Link>
          </Button>
        </div>

        <WorkoutDatePicker date={date} />
        <Suspense fallback={<WorkoutListSkeleton />}>
          <WorkoutList date={date} />
        </Suspense>
      </div>
    </div>
  );
}
