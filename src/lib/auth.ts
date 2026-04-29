import { SESSION_STORAGE_KEY, USERS_STORAGE_KEY } from "@/lib/constants";
import { readStorageValue, writeStorageValue } from "@/lib/storage";
import type { Session, User } from "@/types/auth";

function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function getUsers(): User[] {
  return readStorageValue<User[]>(USERS_STORAGE_KEY, []);
}

export function saveUsers(users: User[]): void {
  writeStorageValue<User[]>(USERS_STORAGE_KEY, users);
}

export function getSession(): Session | null {
  return readStorageValue<Session | null>(SESSION_STORAGE_KEY, null);
}

export function saveSession(session: Session | null): void {
  writeStorageValue<Session | null>(SESSION_STORAGE_KEY, session);
}

export function clearSession(): void {
  saveSession(null);
}

export function signupUser(email: string, password: string): Session {
  const normalizedEmail = email.trim().toLowerCase();
  const users = getUsers();

  const existingUser = users.find((user) => user.email === normalizedEmail);
  if (existingUser) {
    throw new Error("User already exists");
  }

  const newUser: User = {
    id: generateId(),
    email: normalizedEmail,
    password,
    createdAt: new Date().toISOString(),
  };

  const updatedUsers = [...users, newUser];
  saveUsers(updatedUsers);

  const session: Session = {
    userId: newUser.id,
    email: newUser.email,
  };
  saveSession(session);

  return session;
}

export function loginUser(email: string, password: string): Session {
  const normalizedEmail = email.trim().toLowerCase();
  const users = getUsers();

  const user = users.find(
    (item) => item.email === normalizedEmail && item.password === password,
  );

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const session: Session = {
    userId: user.id,
    email: user.email,
  };
  saveSession(session);

  return session;
}

export function logoutUser(): void {
  clearSession();
}
