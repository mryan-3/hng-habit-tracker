"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signupUser } from "@/lib/auth";
import { UserPlus, EnvelopeSimple, LockKey } from "@phosphor-icons/react";

export function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    try {
      signupUser(email, password);
      router.push("/dashboard");
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "User already exists",
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm space-y-5 rounded-2xl border border-zinc-100 bg-white p-8 shadow-lg shadow-zinc-200/50"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-teal-600">
          <UserPlus size={24} weight="duotone" />
        </div>
        <h1 className="text-2xl font-bold text-zinc-900">Create Account</h1>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="signup-email"
          className="text-sm font-semibold text-zinc-700"
        >
          Email Address
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
            <EnvelopeSimple size={18} />
          </div>
          <input
            id="signup-email"
            data-testid="auth-signup-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            suppressHydrationWarning
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 pl-10 pr-3 text-zinc-900 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="signup-password"
          className="text-sm font-semibold text-zinc-700"
        >
          Password
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
            <LockKey size={18} />
          </div>
          <input
            id="signup-password"
            data-testid="auth-signup-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            suppressHydrationWarning
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 pl-10 pr-3 text-zinc-900 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
            placeholder="••••••••"
          />
        </div>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        data-testid="auth-signup-submit"
        type="submit"
        className="mt-2 w-full rounded-xl bg-zinc-900 py-2.5 font-semibold text-white shadow-md transition hover:bg-zinc-800 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-zinc-900/20 active:scale-[0.98]"
      >
        Sign Up
      </button>
    </form>
  );
}
