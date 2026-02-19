import WorkoutDiary from "./_components/WorkoutDiary";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            View your workouts for a given day.
          </p>
        </div>

        <WorkoutDiary />
      </div>
    </div>
  );
}
