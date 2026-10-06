import { describe, expect, it } from "vitest";
import { MAX_TITLE_LENGTH, parseTitle } from "../lib/validation";

describe("parseTitle", () => {
  it("returns the trimmed title", () => {
    expect(parseTitle("  Water the plants ")).toBe("Water the plants");
  });

  it("rejects blank titles", () => {
    expect(parseTitle("")).toBeNull();
    expect(parseTitle("   ")).toBeNull();
  });

  it("rejects titles longer than the limit", () => {
    expect(parseTitle("x".repeat(MAX_TITLE_LENGTH + 1))).toBeNull();
  });

  it("rejects non-string values", () => {
    expect(parseTitle(undefined)).toBeNull();
    expect(parseTitle(42)).toBeNull();
    expect(parseTitle(["a title"])).toBeNull();
  });
});
