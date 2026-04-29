import { describe, expect, it } from "vitest";
import { readStorageValue, writeStorageValue } from "@/lib/storage";

describe("storage helpers", () => {
  it("reads fallback when key is missing", () => {
    expect(readStorageValue("missing-key", { ok: true })).toEqual({ ok: true });
  });

  it("writes and reads JSON values", () => {
    writeStorageValue("sample-key", { name: "Habit Tracker" });
    expect(readStorageValue("sample-key", { name: "" })).toEqual({
      name: "Habit Tracker",
    });
  });

  it("returns fallback when stored value is invalid JSON", () => {
    window.localStorage.setItem("broken-json", "{invalid");
    expect(readStorageValue("broken-json", ["fallback"])).toEqual(["fallback"]);
  });
});
