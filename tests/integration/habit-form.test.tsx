import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DashboardPage from "@/app/dashboard/page";
import { HABITS_STORAGE_KEY, SESSION_STORAGE_KEY } from "@/lib/constants";
import { getHabitSlug } from "@/lib/slug";

const pushMock = vi.fn();
const replaceMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    replace: replaceMock,
  }),
}));

const session = { userId: "user-1", email: "user@example.com" };

describe("habit form", () => {
  beforeEach(() => {
    window.localStorage.clear();
    pushMock.mockClear();
    replaceMock.mockClear();
    window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  });

  it("shows a validation error when habit name is empty", async () => {
    const user = userEvent.setup();
    render(<DashboardPage />);

    await user.click(screen.getByTestId("create-habit-button"));
    await user.click(screen.getByTestId("habit-save-button"));

    expect(screen.getByText("Habit name is required")).toBeInTheDocument();
  });

  it("creates a new habit and renders it in the list", async () => {
    const user = userEvent.setup();
    render(<DashboardPage />);

    await user.click(screen.getByTestId("create-habit-button"));
    await user.type(screen.getByTestId("habit-name-input"), "Drink Water");
    await user.type(screen.getByTestId("habit-description-input"), "8 cups");
    await user.click(screen.getByTestId("habit-save-button"));

    expect(screen.getByTestId("habit-card-drink-water")).toBeInTheDocument();
  });

  it("edits an existing habit and preserves immutable fields", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(
      HABITS_STORAGE_KEY,
      JSON.stringify([
        {
          id: "habit-1",
          userId: "user-1",
          name: "Drink Water",
          description: "8 cups",
          frequency: "daily",
          createdAt: "2026-04-29T00:00:00.000Z",
          completions: ["2026-04-29"],
        },
      ]),
    );

    render(<DashboardPage />);
    await user.click(screen.getByTestId("habit-edit-drink-water"));

    const nameInput = screen.getByTestId("habit-name-input");
    await user.clear(nameInput);
    await user.type(nameInput, "Drink More Water");
    await user.click(screen.getByTestId("habit-save-button"));

    const savedHabits = JSON.parse(
      window.localStorage.getItem(HABITS_STORAGE_KEY) ?? "[]",
    );
    expect(savedHabits[0].id).toBe("habit-1");
    expect(savedHabits[0].userId).toBe("user-1");
    expect(savedHabits[0].createdAt).toBe("2026-04-29T00:00:00.000Z");
    expect(savedHabits[0].completions).toEqual(["2026-04-29"]);
  });

  it("deletes a habit only after explicit confirmation", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(
      HABITS_STORAGE_KEY,
      JSON.stringify([
        {
          id: "habit-1",
          userId: "user-1",
          name: "Drink Water",
          description: "8 cups",
          frequency: "daily",
          createdAt: "2026-04-29T00:00:00.000Z",
          completions: [],
        },
      ]),
    );

    render(<DashboardPage />);
    await user.click(screen.getByTestId("habit-delete-drink-water"));
    expect(screen.getByTestId("habit-card-drink-water")).toBeInTheDocument();

    await user.click(screen.getByTestId("confirm-delete-button"));
    expect(screen.queryByTestId("habit-card-drink-water")).not.toBeInTheDocument();
  });

  it("toggles completion and updates the streak display", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(
      HABITS_STORAGE_KEY,
      JSON.stringify([
        {
          id: "habit-1",
          userId: "user-1",
          name: "Drink Water",
          description: "8 cups",
          frequency: "daily",
          createdAt: "2026-04-29T00:00:00.000Z",
          completions: [],
        },
      ]),
    );

    render(<DashboardPage />);
    const slug = getHabitSlug("Drink Water");
    const streakLabel = screen.getByTestId(`habit-streak-${slug}`);
    expect(within(streakLabel).getByText("0")).toBeInTheDocument();

    await user.click(screen.getByTestId(`habit-complete-${slug}`));
    expect(within(screen.getByTestId(`habit-streak-${slug}`)).getByText("1")).toBeInTheDocument();
  });
});
