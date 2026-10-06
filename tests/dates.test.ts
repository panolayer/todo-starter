import { describe, expect, it } from "vitest";
import {
  addDays,
  daysUntil,
  isDateKey,
  isDueSoon,
  isOverdue,
  parseDueDate,
  toDateKey,
} from "../lib/dates";

const TODAY = "2025-03-10";
const open = (dueDate: string | null) => ({ completed: false, dueDate });

describe("toDateKey", () => {
  it("formats the local calendar day with zero padding", () => {
    expect(toDateKey(new Date(2025, 0, 5, 23, 59))).toBe("2025-01-05");
  });
});

describe("isDateKey", () => {
  it("accepts real calendar days", () => {
    expect(isDateKey("2025-03-10")).toBe(true);
    expect(isDateKey("2024-02-29")).toBe(true);
  });

  it("rejects other formats and impossible days", () => {
    expect(isDateKey("2025-3-10")).toBe(false);
    expect(isDateKey("10/03/2025")).toBe(false);
    expect(isDateKey("2025-02-30")).toBe(false);
    expect(isDateKey("2025-13-01")).toBe(false);
  });
});

describe("addDays and daysUntil", () => {
  it("moves across month and year boundaries", () => {
    expect(addDays("2025-01-31", 1)).toBe("2025-02-01");
    expect(addDays("2025-01-01", -1)).toBe("2024-12-31");
  });

  it("counts whole days, negative once the day has passed", () => {
    expect(daysUntil(TODAY, TODAY)).toBe(0);
    expect(daysUntil("2025-03-11", TODAY)).toBe(1);
    expect(daysUntil("2025-03-01", TODAY)).toBe(-9);
  });
});

describe("isOverdue", () => {
  it("is true only for open todos due before today", () => {
    expect(isOverdue(open("2025-03-09"), TODAY)).toBe(true);
    expect(isOverdue(open(TODAY), TODAY)).toBe(false);
    expect(isOverdue(open(null), TODAY)).toBe(false);
    expect(isOverdue({ completed: true, dueDate: "2025-03-01" }, TODAY)).toBe(false);
  });
});

describe("isDueSoon", () => {
  it("includes todos due today and tomorrow", () => {
    expect(isDueSoon(open(TODAY), TODAY)).toBe(true);
    expect(isDueSoon(open("2025-03-11"), TODAY)).toBe(true);
  });

  it("excludes overdue, far-off, undated and completed todos", () => {
    expect(isDueSoon(open("2025-03-09"), TODAY)).toBe(false);
    expect(isDueSoon(open("2025-03-20"), TODAY)).toBe(false);
    expect(isDueSoon(open(null), TODAY)).toBe(false);
    expect(isDueSoon({ completed: true, dueDate: TODAY }, TODAY)).toBe(false);
  });
});

describe("parseDueDate", () => {
  it("returns a valid day unchanged", () => {
    expect(parseDueDate("2025-03-10")).toBe("2025-03-10");
  });

  it("treats null and empty string as clearing the due date", () => {
    expect(parseDueDate(null)).toBeNull();
    expect(parseDueDate("")).toBeNull();
  });

  it("rejects malformed and impossible days", () => {
    expect(parseDueDate("next week")).toBeUndefined();
    expect(parseDueDate("2025-3-10")).toBeUndefined();
    expect(parseDueDate("2025-02-30")).toBeUndefined();
  });

  it("rejects non-string values", () => {
    expect(parseDueDate(20250310)).toBeUndefined();
    expect(parseDueDate({ date: "2025-03-10" })).toBeUndefined();
  });
});
