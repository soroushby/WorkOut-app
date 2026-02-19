"use server";

import { z } from "zod";
import { parseISO, startOfDay } from "date-fns";
import { createWorkout } from "@/data/workouts";

const createWorkoutSchema = z.object({
  name: z.string().min(1, "Name is required"),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Must be a valid YYYY-MM-DD date"),
});

export async function createWorkoutAction(name: string, date: string) {
  const { name: validatedName, date: validatedDate } = createWorkoutSchema.parse({ name, date });

  const startedAt = startOfDay(parseISO(validatedDate));

  return createWorkout(validatedName, startedAt);
}
