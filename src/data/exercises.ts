import { db } from "@/db";
import { exercises } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function getAllExercises() {
  return db.select({ id: exercises.id, name: exercises.name }).from(exercises);
}

export async function findOrCreateExercise(name: string) {
  const trimmed = name.trim();
  const lower = trimmed.toLowerCase();

  const [existing] = await db
    .select()
    .from(exercises)
    .where(sql`lower(${exercises.name}) = ${lower}`)
    .limit(1);

  if (existing) return existing;

  const [created] = await db
    .insert(exercises)
    .values({ name: trimmed })
    .returning();

  return created;
}
