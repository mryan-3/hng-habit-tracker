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
import { SignOut, Plus, Leaf } from "@phosphor-icons/react";

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
        className="mx-auto min-h-screen w-full max-w-2xl space-y-6 bg-zinc-50 px-4 py-8"
      >
        <header className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm border border-zinc-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-teal-600">
              <Leaf size={24} weight="duotone" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Habit Tracker</h1>
              {isClient && session ? (
                <p className="text-sm font-medium text-zinc-500">{session.email}</p>
              ) : null}
            </div>
          </div>
          <button
            data-testid="auth-logout-button"
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50 focus:outline-none focus:ring-4 focus:ring-zinc-100"
          >
            <SignOut size={18} />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </header>

        {!isFormVisible ? (
          <button
            data-testid="create-habit-button"
            type="button"
            onClick={openCreateForm}
            className="flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 font-semibold text-white shadow-md transition hover:bg-zinc-800 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-zinc-900/20 active:scale-[0.98]"
          >
            <Plus size={20} weight="bold" />
            Create New Habit
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
            className="flex flex-col items-center justify-center space-y-3 rounded-2xl border border-dashed border-zinc-300 bg-white/50 p-12 text-center"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
              <Leaf size={28} weight="duotone" />
            </div>
            <p className="text-base font-medium text-zinc-600">
              No habits yet. Create your first habit to start tracking.
            </p>
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
