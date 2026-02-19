import {
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ------------------------------------------------------------
// exercises — reusable reference table, not tied to any workout
// ------------------------------------------------------------
export const exercises = pgTable("exercises", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull().unique(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

// ------------------------------------------------------------
// workouts — a single workout session for a user
// ------------------------------------------------------------
export const workouts = pgTable("workouts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: text().notNull(),
  name: text().notNull(),
  startedAt: timestamp().notNull(),
  completedAt: timestamp(),
  createdAt: timestamp().defaultNow().notNull(),
});

// ------------------------------------------------------------
// workout_exercises — junction table linking a workout to exercises
// preserves ordering of exercises within a workout
// ------------------------------------------------------------
export const workoutExercises = pgTable("workout_exercises", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  workoutId: integer()
    .notNull()
    .references(() => workouts.id, { onDelete: "cascade" }),
  exerciseId: integer()
    .notNull()
    .references(() => exercises.id, { onDelete: "restrict" }),
  order: integer().notNull().default(0),
  createdAt: timestamp().defaultNow().notNull(),
});

// ------------------------------------------------------------
// sets — individual sets belonging to a workout_exercise entry
// ------------------------------------------------------------
export const sets = pgTable("sets", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  workoutExerciseId: integer()
    .notNull()
    .references(() => workoutExercises.id, { onDelete: "cascade" }),
  order: integer().notNull().default(0),
  reps: integer().notNull(),
  weight: numeric({ precision: 6, scale: 2 }).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
});

// ------------------------------------------------------------
// Relations (used by Drizzle's query API)
// ------------------------------------------------------------
export const workoutsRelations = relations(workouts, ({ many }) => ({
  workoutExercises: many(workoutExercises),
}));

export const exercisesRelations = relations(exercises, ({ many }) => ({
  workoutExercises: many(workoutExercises),
}));

export const workoutExercisesRelations = relations(
  workoutExercises,
  ({ one, many }) => ({
    workout: one(workouts, {
      fields: [workoutExercises.workoutId],
      references: [workouts.id],
    }),
    exercise: one(exercises, {
      fields: [workoutExercises.exerciseId],
      references: [exercises.id],
    }),
    sets: many(sets),
  })
);

export const setsRelations = relations(sets, ({ one }) => ({
  workoutExercise: one(workoutExercises, {
    fields: [sets.workoutExerciseId],
    references: [workoutExercises.id],
  }),
}));
