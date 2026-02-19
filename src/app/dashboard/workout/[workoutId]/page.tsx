import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWorkoutById, getWorkoutExercisesWithSets } from "@/data/workouts";
import { getAllExercises } from "@/data/exercises";
import EditWorkoutForm from "./_components/EditWorkoutForm";
import ExerciseLogger from "./_components/ExerciseLogger";

type Props = {
  params: Promise<{ workoutId: string }>;
};

export default async function EditWorkoutPage({ params }: Props) {
  const { workoutId: workoutIdParam } = await params;
  const workoutId = parseInt(workoutIdParam, 10);

  if (isNaN(workoutId)) notFound();

  const workout = await getWorkoutById(workoutId);

  if (!workout) notFound();

  const [allExercises, workoutExercises] = await Promise.all([
    getAllExercises(),
    getWorkoutExercisesWithSets(workoutId),
  ]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
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

        <ExerciseLogger
          workoutId={workout.id}
          allExercises={allExercises}
          workoutExercises={workoutExercises}
        />
      </div>
    </div>
  );
}
