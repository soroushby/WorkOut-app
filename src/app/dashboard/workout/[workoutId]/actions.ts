"use server";

import { z } from "zod";
import { parseISO, startOfDay } from "date-fns";
import { updateWorkout } from "@/data/workouts";

const updateWorkoutSchema = z.object({
  workoutId: z.number().int().positive(),
  name: z.string().min(1, "Name is required"),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Must be a valid YYYY-MM-DD date"),
});

export async function updateWorkoutAction(
  workoutId: number,
  name: string,
  date: string
) {
  const {
    workoutId: validatedId,
    name: validatedName,
    date: validatedDate,
  } = updateWorkoutSchema.parse({ workoutId, name, date });

  const startedAt = startOfDay(parseISO(validatedDate));

  return updateWorkout(validatedId, validatedName, startedAt);
}
