import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWorkoutById } from "@/data/workouts";
import EditWorkoutForm from "./_components/EditWorkoutForm";

type Props = {
  params: Promise<{ workoutId: string }>;
};

export default async function EditWorkoutPage({ params }: Props) {
  const { workoutId: workoutIdParam } = await params;
  const workoutId = parseInt(workoutIdParam, 10);

  if (isNaN(workoutId)) notFound();

  const workout = await getWorkoutById(workoutId);

  if (!workout) notFound();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            Edit workout
          </h1>
          <p className="text-muted-foreground text-sm">
            Update the details for this workout session.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Workout details</CardTitle>
          </CardHeader>
          <CardContent>
            <EditWorkoutForm
              workoutId={workout.id}
              defaultName={workout.name}
              defaultDate={workout.startedAt}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
