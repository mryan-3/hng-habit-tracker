"use client";

import { useState } from "react";
import type { Habit } from "@/types/habit";
import { getHabitSlug } from "@/lib/slug";
import { calculateCurrentStreak } from "@/lib/streaks";
import { CheckCircle, PencilSimple, Trash, Fire } from "@phosphor-icons/react";

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
          ? "border-teal-500 bg-teal-50"
          : "border-zinc-200 bg-white"
      }`}
    >
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-zinc-900">{habit.name}</h3>
        {habit.description ? (
          <p className="text-sm text-zinc-600">{habit.description}</p>
        ) : null}
      </div>

      <p data-testid={`habit-streak-${habitSlug}`} className="mt-4 flex items-center gap-1.5 text-sm font-medium text-zinc-600">
        <Fire size={18} weight="fill" className={streak > 0 ? "text-orange-500" : "text-zinc-400"} />
        <span>Streak: <strong className="text-zinc-900">{streak}</strong> days</span>
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-zinc-100 pt-4">
        <button
          data-testid={`habit-complete-${habitSlug}`}
          type="button"
          onClick={() => onToggleComplete(habit)}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isCompletedToday
              ? "bg-teal-50 text-teal-700 hover:bg-teal-100 focus:ring-teal-500"
              : "bg-zinc-900 text-white hover:bg-zinc-800 hover:shadow-md focus:ring-zinc-900"
          }`}
        >
          <CheckCircle size={18} weight={isCompletedToday ? "fill" : "regular"} />
          {isCompletedToday ? "Completed Today" : "Mark Complete"}
        </button>

        <div className="ml-auto flex items-center gap-2">
          <button
            data-testid={`habit-edit-${habitSlug}`}
            type="button"
            onClick={() => onEdit(habit)}
            className="flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-1"
          >
            <PencilSimple size={16} />
            <span className="hidden sm:inline">Edit</span>
          </button>

          {!isConfirmingDelete ? (
            <button
              data-testid={`habit-delete-${habitSlug}`}
              type="button"
              onClick={() => setIsConfirmingDelete(true)}
              className="flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
            >
              <Trash size={16} />
              <span className="hidden sm:inline">Delete</span>
            </button>
          ) : (
            <button
              data-testid="confirm-delete-button"
              type="button"
              onClick={() => onDelete(habit)}
              className="flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
            >
              <Trash size={16} weight="fill" />
              Confirm
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
