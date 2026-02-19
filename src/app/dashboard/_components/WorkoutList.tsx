import Link from "next/link";
import { format, differenceInMinutes } from "date-fns";
import { Dumbbell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWorkoutsForDate } from "@/data/workouts";

type Props = {
  date: Date;
};

export default async function WorkoutList({ date }: Props) {
  const workouts = await getWorkoutsForDate(date);

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
        Workouts — {format(date, "do MMM yyyy")}
      </h2>

      {workouts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Dumbbell className="size-8 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">
              No workouts logged for this day.
            </p>
          </CardContent>
        </Card>
      ) : (
        workouts.map((workout) => {
          const duration =
            workout.completedAt
              ? `${differenceInMinutes(workout.completedAt, workout.startedAt)} min`
              : "In progress";

          return (
            <Link key={workout.id} href={`/dashboard/workout/${workout.id}`}>
              <Card className="transition-colors hover:bg-muted/50">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{workout.name}</CardTitle>
                    <span className="text-sm text-muted-foreground">
                      {duration}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {format(workout.startedAt, "h:mm a")}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })
      )}
    </div>
  );
}
