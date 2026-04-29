import { describe, expect, it } from "vitest";
import {
  clearSession,
  getSession,
  getUsers,
  loginUser,
  logoutUser,
  saveSession,
  saveUsers,
  signupUser,
} from "@/lib/auth";

describe("auth helpers", () => {
  it("signs up a user and creates a session", () => {
    const session = signupUser("USER@example.com", "password123");
    const users = getUsers();

    expect(users).toHaveLength(1);
    expect(users[0].email).toBe("user@example.com");
    expect(session.email).toBe("user@example.com");
    expect(getSession()).toEqual(session);
  });

  it("rejects duplicate email signup", () => {
    signupUser("test@example.com", "one");
    expect(() => signupUser("test@example.com", "two")).toThrow(
      "User already exists",
    );
  });

  it("logs in an existing user", () => {
    saveUsers([
      {
        id: "u1",
        email: "a@b.com",
        password: "pass",
        createdAt: "2026-01-01T00:00:00.000Z",
      },
    ]);

    const session = loginUser("a@b.com", "pass");
    expect(session).toEqual({ userId: "u1", email: "a@b.com" });
    expect(getSession()).toEqual({ userId: "u1", email: "a@b.com" });
  });

  it("rejects invalid login credentials", () => {
    saveUsers([
      {
        id: "u1",
        email: "a@b.com",
        password: "pass",
        createdAt: "2026-01-01T00:00:00.000Z",
      },
    ]);

    expect(() => loginUser("a@b.com", "wrong")).toThrow(
      "Invalid email or password",
    );
  });

  it("clears session on logout", () => {
    saveSession({ userId: "u1", email: "a@b.com" });
    logoutUser();
    expect(getSession()).toBeNull();
  });

  it("can clear session explicitly", () => {
    saveSession({ userId: "u1", email: "a@b.com" });
    clearSession();
    expect(getSession()).toBeNull();
  });
});
