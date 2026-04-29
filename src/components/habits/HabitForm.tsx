"use client";

import { FormEvent, useState } from "react";
import type { Habit } from "@/types/habit";
import { validateHabitName } from "@/lib/validators";
import { FloppyDisk, X, TextAa, TextAlignLeft, CalendarBlank } from "@phosphor-icons/react";

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
      className="space-y-4 rounded-xl border border-zinc-100 bg-white p-6 shadow-sm"
    >
      <div className="space-y-1.5">
        <label htmlFor="habit-name" className="text-sm font-semibold text-zinc-700">
          Habit Name
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
            <TextAa size={18} />
          </div>
          <input
            id="habit-name"
            data-testid="habit-name-input"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2.5 pl-10 pr-3 text-zinc-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
            placeholder="e.g., Drink 8 glasses of water"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="habit-description"
          className="text-sm font-semibold text-zinc-700"
        >
          Description (Optional)
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute top-3 left-0 flex items-center pl-3 text-zinc-400">
            <TextAlignLeft size={18} />
          </div>
          <textarea
            id="habit-description"
            data-testid="habit-description-input"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            className="w-full resize-none rounded-lg border border-zinc-200 bg-zinc-50 py-2.5 pl-10 pr-3 text-zinc-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
            placeholder="Add details about your habit..."
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="habit-frequency"
          className="text-sm font-semibold text-zinc-700"
        >
          Frequency
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
            <CalendarBlank size={18} />
          </div>
          <select
            id="habit-frequency"
            data-testid="habit-frequency-select"
            value="daily"
            disabled
            className="w-full appearance-none rounded-lg border border-zinc-200 bg-zinc-100 py-2.5 pl-10 pr-3 text-zinc-500 outline-none opacity-80"
          >
            <option value="daily">Daily</option>
          </select>
        </div>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="flex gap-3 pt-2 border-t border-zinc-100">
        <button
          data-testid="habit-save-button"
          type="submit"
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-zinc-900 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 hover:shadow focus:outline-none focus:ring-4 focus:ring-zinc-900/20 active:scale-[0.98]"
        >
          <FloppyDisk size={18} />
          Save Habit
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 focus:outline-none focus:ring-4 focus:ring-zinc-200 active:scale-[0.98]"
        >
          <X size={18} />
          Cancel
        </button>
      </div>
    </form>
  );
}
