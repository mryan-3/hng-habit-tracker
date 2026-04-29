import { describe, expect, it } from "vitest";
import { toggleHabitCompletion } from "@/lib/habits";
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
});
