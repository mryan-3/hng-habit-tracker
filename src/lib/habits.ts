import type { Habit } from "@/types/habit";
import { HABITS_STORAGE_KEY } from "@/lib/constants";
import { readStorageValue, writeStorageValue } from "@/lib/storage";

function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function toggleHabitCompletion(habit: Habit, date: string): Habit {
  const completions = new Set(habit.completions);

  if (completions.has(date)) {
    completions.delete(date);
  } else {
    completions.add(date);
  }

  return {
    ...habit,
    completions: Array.from(completions).sort(),
  };
}

export function getHabits(): Habit[] {
  return readStorageValue<Habit[]>(HABITS_STORAGE_KEY, []);
}

export function saveHabits(habits: Habit[]): void {
  writeStorageValue<Habit[]>(HABITS_STORAGE_KEY, habits);
}

export function getHabitsByUser(userId: string): Habit[] {
  return getHabits().filter((habit) => habit.userId === userId);
}

export function createHabit(
  userId: string,
  input: { name: string; description: string },
): Habit {
  const newHabit: Habit = {
    id: generateId(),
    userId,
    name: input.name,
    description: input.description,
    frequency: "daily",
    createdAt: new Date().toISOString(),
    completions: [],
  };

  const habits = getHabits();
  saveHabits([...habits, newHabit]);

  return newHabit;
}

export function updateHabit(
  habitId: string,
  updates: { name: string; description: string },
): Habit {
  const habits = getHabits();
  const existingHabit = habits.find((habit) => habit.id === habitId);

  if (!existingHabit) {
    throw new Error("Habit not found");
  }

  const updatedHabit: Habit = {
    ...existingHabit,
    name: updates.name,
    description: updates.description,
  };

  const nextHabits = habits.map((habit) =>
    habit.id === habitId ? updatedHabit : habit,
  );
  saveHabits(nextHabits);

  return updatedHabit;
}

export function deleteHabit(habitId: string): void {
  const habits = getHabits();
  const nextHabits = habits.filter((habit) => habit.id !== habitId);
  saveHabits(nextHabits);
}

export function toggleHabitCompletionForDate(habitId: string, date: string): Habit {
  const habits = getHabits();
  const existingHabit = habits.find((habit) => habit.id === habitId);

  if (!existingHabit) {
    throw new Error("Habit not found");
  }

  const updatedHabit = toggleHabitCompletion(existingHabit, date);
  const nextHabits = habits.map((habit) =>
    habit.id === habitId ? updatedHabit : habit,
  );
  saveHabits(nextHabits);

  return updatedHabit;
}
