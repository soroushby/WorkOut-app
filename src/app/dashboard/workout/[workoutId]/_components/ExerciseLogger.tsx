"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addExerciseAction } from "../actions";

type Props = {
  workoutId: number;
  allExercises: { id: number; name: string }[];
  workoutExercises: {
    id: number;
    exercise: { name: string };
    sets: { id: number; order: number; reps: number; weight: string }[];
  }[];
};

export default function ExerciseLogger({
  workoutId,
  allExercises,
  workoutExercises,
}: Props) {
  const router = useRouter();
  const [exerciseName, setExerciseName] = useState("");
  const [sets, setSets] = useState([{ reps: "", weight: "" }]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function addSetRow() {
    setSets((prev) => [...prev, { reps: "", weight: "" }]);
  }

  function removeSetRow(index: number) {
    setSets((prev) => prev.filter((_, i) => i !== index));
  }

  function updateSet(index: number, field: "reps" | "weight", value: string) {
    setSets((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  }

  function handleSave() {
    setError(null);

    if (!exerciseName.trim()) {
      setError("Exercise name is required");
      return;
    }

    const parsedSets = sets.map((s, i) => ({
      reps: parseInt(s.reps, 10),
      weight: parseFloat(s.weight),
      order: i,
    }));

    if (parsedSets.some((s) => isNaN(s.reps) || s.reps <= 0)) {
      setError("All sets must have valid reps (positive whole number)");
      return;
    }

    if (parsedSets.some((s) => isNaN(s.weight) || s.weight < 0)) {
      setError("All sets must have valid weight (0 or more)");
      return;
    }

    startTransition(async () => {
      const result = await addExerciseAction(
        workoutId,
        exerciseName.trim(),
        parsedSets
      );
      if ("error" in result) {
        setError(result.error);
      } else {
        setExerciseName("");
        setSets([{ reps: "", weight: "" }]);
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-6">
      {workoutExercises.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight">
            Logged exercises
          </h2>
          {workoutExercises.map((we) => (
            <Card key={we.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{we.exercise.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {we.sets.map((set, i) => (
                    <li key={set.id}>
                      Set {i + 1}: {set.reps} reps &times; {set.weight} kg
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add exercise</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="exercise-name">Exercise name</Label>
            <Input
              id="exercise-name"
              list="exercises-datalist"
              value={exerciseName}
              onChange={(e) => setExerciseName(e.target.value)}
              placeholder="e.g. Bench Press"
            />
            <datalist id="exercises-datalist">
              {allExercises.map((ex) => (
                <option key={ex.id} value={ex.name} />
              ))}
            </datalist>
          </div>

          <div className="space-y-2">
            <Label>Sets</Label>
            {sets.map((set, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-12 text-sm text-muted-foreground">
                  Set {i + 1}
                </span>
                <Input
                  type="number"
                  min="1"
                  placeholder="Reps"
                  value={set.reps}
                  onChange={(e) => updateSet(i, "reps", e.target.value)}
                  className="w-24"
                />
                <Input
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="kg"
                  value={set.weight}
                  onChange={(e) => updateSet(i, "weight", e.target.value)}
                  className="w-24"
                />
                {sets.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSetRow(i)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addSetRow}
            >
              Add set
            </Button>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button onClick={handleSave} disabled={isPending}>
            {isPending ? "Saving..." : "Save exercise"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
