import { parseISO } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NewWorkoutForm from "./_components/NewWorkoutForm";

type Props = {
  searchParams: Promise<{ date?: string }>;
};

export default async function NewWorkoutPage({ searchParams }: Props) {
  const { date: dateParam } = await searchParams;
  const parsedDate = dateParam ? parseISO(dateParam) : new Date();
  const defaultDate = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">
            New workout
          </h1>
          <p className="text-muted-foreground text-sm">
            Log a new workout session.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Workout details</CardTitle>
          </CardHeader>
          <CardContent>
            <NewWorkoutForm defaultDate={defaultDate} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
