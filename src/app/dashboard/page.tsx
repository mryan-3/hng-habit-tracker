"use client";

import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import type { Habit } from "@/types/habit";
import { getSession, logoutUser } from "@/lib/auth";
import {
  createHabit,
  deleteHabit,
  getHabitsByUser,
  toggleHabitCompletionForDate,
  updateHabit,
} from "@/lib/habits";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { HabitForm } from "@/components/habits/HabitForm";
import { HabitList } from "@/components/habits/HabitList";

type HabitFormValues = {
  name: string;
  description: string;
  frequency: "daily";
};

function getTodayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function DashboardPage() {
  const router = useRouter();
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const session = isClient ? getSession() : null;
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const todayIso = getTodayIsoDate();
  const habits = isClient && session ? getHabitsByUser(session.userId) : [];

  const closeForm = () => {
    setIsFormVisible(false);
    setEditingHabit(null);
  };

  const openCreateForm = () => {
    setEditingHabit(null);
    setIsFormVisible(true);
  };

  const handleSaveHabit = (values: HabitFormValues) => {
    if (!session) {
      return;
    }

    if (editingHabit) {
      updateHabit(editingHabit.id, {
        name: values.name,
        description: values.description,
      });
    } else {
      createHabit(session.userId, {
        name: values.name,
        description: values.description,
      });
    }

    setRefreshKey((current) => current + 1);
    closeForm();
  };

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setIsFormVisible(true);
  };

  const handleDeleteHabit = (habit: Habit) => {
    deleteHabit(habit.id);
    setRefreshKey((current) => current + 1);
  };

  const handleToggleHabit = (habit: Habit) => {
    toggleHabitCompletionForDate(habit.id, todayIso);
    setRefreshKey((current) => current + 1);
  };

  const handleLogout = () => {
    logoutUser();
    router.push("/login");
  };

  return (
    <ProtectedRoute>
      <main
        data-testid="dashboard-page"
        className="mx-auto min-h-screen w-full max-w-2xl space-y-4 bg-slate-50 px-4 py-6"
      >
        <header className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Habit Tracker</h1>
            {isClient && session ? (
              <p className="text-sm text-slate-600">{session.email}</p>
            ) : null}
          </div>
          <button
            data-testid="auth-logout-button"
            type="button"
            onClick={handleLogout}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            Log out
          </button>
        </header>

        {!isFormVisible ? (
          <button
            data-testid="create-habit-button"
            type="button"
            onClick={openCreateForm}
            className="rounded-md bg-slate-900 px-4 py-2 font-medium text-white focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            Create Habit
          </button>
        ) : null}

        {isFormVisible ? (
          <HabitForm
            key={editingHabit?.id ?? "create"}
            initialHabit={editingHabit}
            onSave={handleSaveHabit}
            onCancel={closeForm}
          />
        ) : null}

        {habits.length === 0 ? (
          <section
            data-testid="empty-state"
            className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center text-slate-600"
          >
            No habits yet. Create your first habit to start tracking.
          </section>
        ) : (
          <div key={refreshKey}>
            <HabitList
              habits={habits}
              todayIso={todayIso}
              onToggleComplete={handleToggleHabit}
              onEdit={handleEditHabit}
              onDelete={handleDeleteHabit}
            />
          </div>
        )}
      </main>
    </ProtectedRoute>
  );
}
