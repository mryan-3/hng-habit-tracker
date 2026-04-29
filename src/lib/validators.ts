export function validateHabitName(name: string): {
  valid: boolean;
  value: string;
  error: string | null;
} {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return {
      valid: false,
      value: "",
      error: "Habit name is required",
    };
  }

  if (trimmedName.length > 60) {
    return {
      valid: false,
      value: "",
      error: "Habit name must be 60 characters or fewer",
    };
  }

  return {
    valid: true,
    value: trimmedName,
    error: null,
  };
}
