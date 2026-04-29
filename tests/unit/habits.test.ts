import { describe, expect, it } from "vitest";
import {
  createHabit,
  deleteHabit,
  getHabits,
  getHabitsByUser,
  saveHabits,
  toggleHabitCompletion,
  toggleHabitCompletionForDate,
  updateHabit,
} from "@/lib/habits";
import type { Habit } from "@/types/habit";

const baseHabit: Habit = {
  id: "habit-1",
  userId: "user-1",
  name: "Drink Water",
  description: "8 glasses",
  frequency: "daily",
  createdAt: "2026-04-29T00:00:00.000Z",
  completions: [],
};

describe("toggleHabitCompletion", () => {
  it("adds a completion date when the date is not present", () => {
    const updatedHabit = toggleHabitCompletion(baseHabit, "2026-04-29");
    expect(updatedHabit.completions).toEqual(["2026-04-29"]);
  });

  it("removes a completion date when the date already exists", () => {
    const completedHabit: Habit = {
      ...baseHabit,
      completions: ["2026-04-29"],
    };
    const updatedHabit = toggleHabitCompletion(completedHabit, "2026-04-29");
    expect(updatedHabit.completions).toEqual([]);
  });

  it("does not mutate the original habit object", () => {
    const originalHabit: Habit = {
      ...baseHabit,
      completions: ["2026-04-29"],
    };

    const beforeToggle = [...originalHabit.completions];
    toggleHabitCompletion(originalHabit, "2026-04-30");

    expect(originalHabit.completions).toEqual(beforeToggle);
  });

  it("does not return duplicate completion dates", () => {
    const withDuplicates: Habit = {
      ...baseHabit,
      completions: ["2026-04-29", "2026-04-29"],
    };
    const updatedHabit = toggleHabitCompletion(withDuplicates, "2026-04-30");
    expect(updatedHabit.completions).toEqual(["2026-04-29", "2026-04-30"]);
  });

  it("creates and stores a daily habit for a user", () => {
    const created = createHabit("user-2", {
      name: "Read",
      description: "Read 10 pages",
    });

    const habits = getHabits();
    expect(created.userId).toBe("user-2");
    expect(created.frequency).toBe("daily");
    expect(habits).toHaveLength(1);
  });

  it("updates habit fields while preserving immutable fields", () => {
    const existing: Habit = {
      ...baseHabit,
      id: "habit-immutable",
      completions: ["2026-04-29"],
    };
    saveHabits([existing]);

    const updated = updateHabit("habit-immutable", {
      name: "Drink More Water",
      description: "10 glasses",
    });

    expect(updated.id).toBe(existing.id);
    expect(updated.userId).toBe(existing.userId);
    expect(updated.createdAt).toBe(existing.createdAt);
    expect(updated.completions).toEqual(existing.completions);
  });

  it("deletes a habit by id", () => {
    saveHabits([baseHabit]);
    deleteHabit(baseHabit.id);
    expect(getHabits()).toEqual([]);
  });

  it("filters habits by user id", () => {
    saveHabits([
      baseHabit,
      {
        ...baseHabit,
        id: "habit-2",
        userId: "user-2",
      },
    ]);

    expect(getHabitsByUser("user-1")).toHaveLength(1);
    expect(getHabitsByUser("user-2")).toHaveLength(1);
  });

  it("toggles completion for a persisted habit", () => {
    saveHabits([baseHabit]);
    const updated = toggleHabitCompletionForDate(baseHabit.id, "2026-04-29");
    expect(updated.completions).toEqual(["2026-04-29"]);
  });
});
