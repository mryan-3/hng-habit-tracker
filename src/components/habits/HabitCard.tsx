"use client";

import { useState } from "react";
import type { Habit } from "@/types/habit";
import { getHabitSlug } from "@/lib/slug";
import { calculateCurrentStreak } from "@/lib/streaks";

type HabitCardProps = {
  habit: Habit;
  todayIso: string;
  onToggleComplete: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habit: Habit) => void;
};

export function HabitCard({
  habit,
  todayIso,
  onToggleComplete,
  onEdit,
  onDelete,
}: HabitCardProps) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const habitSlug = getHabitSlug(habit.name);
  const streak = calculateCurrentStreak(habit.completions, todayIso);
  const isCompletedToday = habit.completions.includes(todayIso);

  return (
    <article
      data-testid={`habit-card-${habitSlug}`}
      className={`rounded-lg border p-4 ${
        isCompletedToday
          ? "border-emerald-500 bg-emerald-50"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-slate-900">{habit.name}</h3>
        {habit.description ? (
          <p className="text-sm text-slate-600">{habit.description}</p>
        ) : null}
      </div>

      <p data-testid={`habit-streak-${habitSlug}`} className="mt-3 text-sm text-slate-700">
        Current streak: <span className="font-semibold">{streak}</span>
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          data-testid={`habit-complete-${habitSlug}`}
          type="button"
          onClick={() => onToggleComplete(habit)}
          className={`rounded-md px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-300 ${
            isCompletedToday
              ? "bg-emerald-600 text-white hover:bg-emerald-500"
              : "bg-slate-900 text-white hover:bg-slate-800"
          }`}
        >
          {isCompletedToday ? "Completed Today" : "Mark Complete"}
        </button>

        <button
          data-testid={`habit-edit-${habitSlug}`}
          type="button"
          onClick={() => onEdit(habit)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300"
        >
          Edit
        </button>

        {!isConfirmingDelete ? (
          <button
            data-testid={`habit-delete-${habitSlug}`}
            type="button"
            onClick={() => setIsConfirmingDelete(true)}
            className="rounded-md border border-red-300 px-3 py-2 text-sm font-medium text-red-600 focus:outline-none focus:ring-2 focus:ring-red-200"
          >
            Delete
          </button>
        ) : (
          <button
            data-testid="confirm-delete-button"
            type="button"
            onClick={() => onDelete(habit)}
            className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-red-200"
          >
            Confirm Delete
          </button>
        )}
      </div>
    </article>
  );
}
