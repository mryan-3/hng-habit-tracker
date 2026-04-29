"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/auth";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    try {
      loginUser(email, password);
      router.push("/dashboard");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Invalid email or password",
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h1 className="text-2xl font-semibold text-slate-900">Log in</h1>

      <div className="space-y-1">
        <label htmlFor="login-email" className="text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          id="login-email"
          data-testid="auth-login-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        />
      </div>

      <div className="space-y-1">
        <label
          htmlFor="login-password"
          className="text-sm font-medium text-slate-700"
        >
          Password
        </label>
        <input
          id="login-password"
          data-testid="auth-login-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        />
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        data-testid="auth-login-submit"
        type="submit"
        className="w-full rounded-md bg-slate-900 px-4 py-2 font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
      >
        Log in
      </button>
    </form>
  );
}
