import { parseISO } from "date-fns";
import WorkoutDatePicker from "./_components/WorkoutDatePicker";
import WorkoutList from "./_components/WorkoutList";

type Props = {
  searchParams: Promise<{ date?: string }>;
};

export default async function DashboardPage({ searchParams }: Props) {
  const { date: dateParam } = await searchParams;
  const date = dateParam ? parseISO(dateParam) : new Date();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            View your workouts for a given day.
          </p>
        </div>

        <WorkoutDatePicker date={date} />
        <WorkoutList date={date} />
      </div>
    </div>
  );
}
