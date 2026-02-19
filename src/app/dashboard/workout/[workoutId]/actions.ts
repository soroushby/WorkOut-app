"use server";

import { z } from "zod";
import { parseISO, startOfDay } from "date-fns";
import {
  updateWorkout,
  getWorkoutById,
  addWorkoutExercise,
  addSets,
} from "@/data/workouts";
import { findOrCreateExercise } from "@/data/exercises";

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

const addExerciseSchema = z.object({
  workoutId: z.number().int().positive(),
  exerciseName: z.string().min(1, "Exercise name is required").trim(),
  sets: z
    .array(
      z.object({
        reps: z.number().int().positive("Reps must be a positive integer"),
        weight: z.number().nonnegative("Weight must be 0 or more"),
        order: z.number().int().nonnegative(),
      })
    )
    .min(1, "At least one set is required"),
});

export async function addExerciseAction(
  workoutId: number,
  exerciseName: string,
  sets: { reps: number; weight: number; order: number }[]
): Promise<{ error: string } | { success: true }> {
  try {
    const validated = addExerciseSchema.parse({ workoutId, exerciseName, sets });

    const workout = await getWorkoutById(validated.workoutId);
    if (!workout) return { error: "Workout not found" };

    const exercise = await findOrCreateExercise(validated.exerciseName);
    const workoutExercise = await addWorkoutExercise(validated.workoutId, exercise.id);
    await addSets(workoutExercise.id, validated.sets);

    return { success: true };
  } catch (e) {
    if (e instanceof z.ZodError) {
      return { error: e.errors[0]?.message ?? "Invalid input" };
    }
    return { error: "Something went wrong" };
  }
}
