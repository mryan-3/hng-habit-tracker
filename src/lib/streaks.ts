function uniqueSortedDates(completions: string[]): string[] {
  return [...new Set(completions)].sort();
}

function getPreviousIsoDate(isoDate: string): string {
  const currentDate = new Date(`${isoDate}T00:00:00Z`);
  currentDate.setUTCDate(currentDate.getUTCDate() - 1);
  return currentDate.toISOString().slice(0, 10);
}

export function calculateCurrentStreak(
  completions: string[],
  today?: string,
): number {
  const todayIso = today ?? new Date().toISOString().slice(0, 10);
  const sortedUniqueDates = uniqueSortedDates(completions);
  const completionSet = new Set(sortedUniqueDates);

  if (!completionSet.has(todayIso)) {
    return 0;
  }

  let streak = 0;
  let cursorDate = todayIso;

  while (completionSet.has(cursorDate)) {
    streak += 1;
    cursorDate = getPreviousIsoDate(cursorDate);
  }

  return streak;
}
