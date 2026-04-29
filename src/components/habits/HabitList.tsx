"use client";

import type { Habit } from "@/types/habit";
import { HabitCard } from "@/components/habits/HabitCard";

type HabitListProps = {
  habits: Habit[];
  todayIso: string;
  onToggleComplete: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habit: Habit) => void;
};

export function HabitList({
  habits,
  todayIso,
  onToggleComplete,
  onEdit,
  onDelete,
}: HabitListProps) {
  return (
    <div className="space-y-3">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          todayIso={todayIso}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
