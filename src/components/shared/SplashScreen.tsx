import { Leaf } from "@phosphor-icons/react";

export function SplashScreen() {
  return (
    <div
      data-testid="splash-screen"
      className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4"
    >
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-teal-50 text-teal-600 shadow-sm">
        <Leaf size={48} weight="duotone" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Habit Tracker</h1>
      <p className="mt-2 text-sm font-medium text-zinc-500 animate-pulse">Loading your habits...</p>
    </div>
  );
}
