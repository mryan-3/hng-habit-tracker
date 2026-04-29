import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SignupForm } from "@/components/auth/SignupForm";
import { LoginForm } from "@/components/auth/LoginForm";
import { SESSION_STORAGE_KEY, USERS_STORAGE_KEY } from "@/lib/constants";

const pushMock = vi.fn();
const replaceMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    replace: replaceMock,
  }),
}));

describe("auth flow", () => {
  beforeEach(() => {
    pushMock.mockClear();
    replaceMock.mockClear();
    window.localStorage.clear();
  });

  it("submits the signup form and creates a session", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(screen.getByTestId("auth-signup-email"), "new@user.com");
    await user.type(screen.getByTestId("auth-signup-password"), "password123");
    await user.click(screen.getByTestId("auth-signup-submit"));

    const storedUsers = JSON.parse(
      window.localStorage.getItem(USERS_STORAGE_KEY) ?? "[]",
    );
    const storedSession = JSON.parse(
      window.localStorage.getItem(SESSION_STORAGE_KEY) ?? "null",
    );

    expect(storedUsers).toHaveLength(1);
    expect(storedSession.email).toBe("new@user.com");
    expect(pushMock).toHaveBeenCalledWith("/dashboard");
  });

  it("shows an error for duplicate signup email", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(
      USERS_STORAGE_KEY,
      JSON.stringify([
        {
          id: "u1",
          email: "new@user.com",
          password: "password123",
          createdAt: new Date().toISOString(),
        },
      ]),
    );

    render(<SignupForm />);
    await user.type(screen.getByTestId("auth-signup-email"), "new@user.com");
    await user.type(screen.getByTestId("auth-signup-password"), "password123");
    await user.click(screen.getByTestId("auth-signup-submit"));

    expect(screen.getByText("User already exists")).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("submits the login form and stores the active session", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(
      USERS_STORAGE_KEY,
      JSON.stringify([
        {
          id: "u1",
          email: "new@user.com",
          password: "password123",
          createdAt: new Date().toISOString(),
        },
      ]),
    );
    render(<LoginForm />);

    await user.type(screen.getByTestId("auth-login-email"), "new@user.com");
    await user.type(screen.getByTestId("auth-login-password"), "password123");
    await user.click(screen.getByTestId("auth-login-submit"));

    const storedSession = JSON.parse(
      window.localStorage.getItem(SESSION_STORAGE_KEY) ?? "null",
    );

    expect(storedSession).toEqual({ userId: "u1", email: "new@user.com" });
    expect(pushMock).toHaveBeenCalledWith("/dashboard");
  });

  it("shows an error for invalid login credentials", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(
      USERS_STORAGE_KEY,
      JSON.stringify([
        {
          id: "u1",
          email: "new@user.com",
          password: "password123",
          createdAt: new Date().toISOString(),
        },
      ]),
    );

    render(<LoginForm />);
    await user.type(screen.getByTestId("auth-login-email"), "new@user.com");
    await user.type(screen.getByTestId("auth-login-password"), "wrong");
    await user.click(screen.getByTestId("auth-login-submit"));

    expect(screen.getByText("Invalid email or password")).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });
});
