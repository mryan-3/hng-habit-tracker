"use client";

import { FormEvent, useState } from "react";
import type { Habit } from "@/types/habit";
import { validateHabitName } from "@/lib/validators";

type HabitFormValues = {
  name: string;
  description: string;
  frequency: "daily";
};

type HabitFormProps = {
  initialHabit?: Habit | null;
  onSave: (values: HabitFormValues) => void;
  onCancel: () => void;
};

export function HabitForm({ initialHabit, onSave, onCancel }: HabitFormProps) {
  const [name, setName] = useState(initialHabit?.name ?? "");
  const [description, setDescription] = useState(initialHabit?.description ?? "");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = validateHabitName(name);

    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setError(null);
    onSave({
      name: validation.value,
      description: description.trim(),
      frequency: "daily",
    });
  };

  return (
    <form
      data-testid="habit-form"
      onSubmit={handleSubmit}
      className="space-y-3 rounded-lg border border-slate-200 bg-white p-4"
    >
      <div className="space-y-1">
        <label htmlFor="habit-name" className="text-sm font-medium text-slate-700">
          Habit name
        </label>
        <input
          id="habit-name"
          data-testid="habit-name-input"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        />
      </div>

      <div className="space-y-1">
        <label
          htmlFor="habit-description"
          className="text-sm font-medium text-slate-700"
        >
          Description
        </label>
        <textarea
          id="habit-description"
          data-testid="habit-description-input"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={3}
          className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        />
      </div>

      <div className="space-y-1">
        <label
          htmlFor="habit-frequency"
          className="text-sm font-medium text-slate-700"
        >
          Frequency
        </label>
        <select
          id="habit-frequency"
          data-testid="habit-frequency-select"
          value="daily"
          disabled
          className="w-full rounded-md border border-slate-300 bg-slate-100 px-3 py-2 text-slate-700 outline-none"
        >
          <option value="daily">Daily</option>
        </select>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="flex gap-2">
        <button
          data-testid="habit-save-button"
          type="submit"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-slate-300"
        >
          Save Habit
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
