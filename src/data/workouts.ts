import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { workouts, workoutExercises, exercises, sets as setsTable } from "@/db/schema";
import { and, eq, gte, inArray, lt, max } from "drizzle-orm";
import { startOfDay, addDays } from "date-fns";

export async function createWorkout(name: string, startedAt: Date) {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthenticated");

  const [workout] = await db
    .insert(workouts)
    .values({ userId, name, startedAt })
    .returning();

  return workout;
}

export async function getWorkoutById(workoutId: number) {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthenticated");

  const [workout] = await db
    .select()
    .from(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)))
    .limit(1);

  return workout ?? null;
}

export async function updateWorkout(
  workoutId: number,
  name: string,
  startedAt: Date
) {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthenticated");

  const [updated] = await db
    .update(workouts)
    .set({ name, startedAt })
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)))
    .returning();

  return updated;
}


export async function getWorkoutExercisesWithSets(workoutId: number) {
  const weRows = await db
    .select({
      id: workoutExercises.id,
      order: workoutExercises.order,
      exerciseName: exercises.name,
    })
    .from(workoutExercises)
    .innerJoin(exercises, eq(workoutExercises.exerciseId, exercises.id))
    .where(eq(workoutExercises.workoutId, workoutId))
    .orderBy(workoutExercises.order);

  if (weRows.length === 0) return [];

  const weIds = weRows.map((r) => r.id);

  const setRows = await db
    .select({
      id: setsTable.id,
      workoutExerciseId: setsTable.workoutExerciseId,
      order: setsTable.order,
      reps: setsTable.reps,
      weight: setsTable.weight,
    })
    .from(setsTable)
    .where(inArray(setsTable.workoutExerciseId, weIds))
    .orderBy(setsTable.order);

  return weRows.map((we) => ({
    id: we.id,
    exercise: { name: we.exerciseName },
    sets: setRows.filter((s) => s.workoutExerciseId === we.id),
  }));
}

export async function addWorkoutExercise(workoutId: number, exerciseId: number) {
  const [{ maxOrder }] = await db
    .select({ maxOrder: max(workoutExercises.order) })
    .from(workoutExercises)
    .where(eq(workoutExercises.workoutId, workoutId));

  const order = (maxOrder ?? -1) + 1;

  const [row] = await db
    .insert(workoutExercises)
    .values({ workoutId, exerciseId, order })
    .returning();

  return row;
}

export async function addSets(
  workoutExerciseId: number,
  setsData: { reps: number; weight: number; order: number }[]
) {
  return db
    .insert(setsTable)
    .values(setsData.map((s) => ({ workoutExerciseId, ...s, weight: s.weight.toString() })))
    .returning();
}

export async function getWorkoutsForDate(date: Date) {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthenticated");

  return db
    .select({
      id: workouts.id,
      name: workouts.name,
      startedAt: workouts.startedAt,
      completedAt: workouts.completedAt,
    })
    .from(workouts)
    .where(
      and(
        eq(workouts.userId, userId),
        gte(workouts.startedAt, startOfDay(date)),
        lt(workouts.startedAt, startOfDay(addDays(date, 1)))
      )
    )
    .orderBy(workouts.startedAt);
}
