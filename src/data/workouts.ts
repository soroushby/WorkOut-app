import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { and, eq, gte, lt } from "drizzle-orm";
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
