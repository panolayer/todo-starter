import { describe, expect, it } from "vitest";
import { filterTodos, matchesSearch, matchesStatus } from "../lib/filters";
import { DEFAULT_LIMIT, MAX_LIMIT, parseLimit, parseListQuery, parseStatus } from "../lib/query";
import { isAllDone, summarize } from "../lib/stats";
import type { Todo } from "../lib/types";

function todo(title: string, completed = false): Todo {
  return {
    id: title,
    title,
    completed,
    priority: "medium",
    dueDate: null,
    createdAt: "2025-01-01T00:00:00.000Z",
  };
}

const groceries = todo("Buy groceries");
const report = todo("Send the report", true);

describe("matchesStatus", () => {
  it("sorts todos into the all, active and completed tabs", () => {
    expect(matchesStatus(groceries, "all")).toBe(true);
    expect(matchesStatus(report, "all")).toBe(true);
    expect(matchesStatus(groceries, "active")).toBe(true);
    expect(matchesStatus(report, "active")).toBe(false);
    expect(matchesStatus(report, "completed")).toBe(true);
    expect(matchesStatus(groceries, "completed")).toBe(false);
  });
});

describe("matchesSearch", () => {
  it("matches every todo for a blank query", () => {
    expect(matchesSearch(groceries, "")).toBe(true);
    expect(matchesSearch(groceries, "   ")).toBe(true);
  });

  it("finds text anywhere in the title", () => {
    expect(matchesSearch(groceries, "groc")).toBe(true);
    expect(matchesSearch(groceries, " groceries ")).toBe(true);
    expect(matchesSearch(groceries, "report")).toBe(false);
  });
});

describe("filterTodos", () => {
  it("applies the tab and the search together, keeping order", () => {
    const list = [groceries, report, todo("Buy stamps")];
    expect(filterTodos(list, "active", "Buy").map((t) => t.title)).toEqual([
      "Buy groceries",
      "Buy stamps",
    ]);
    expect(filterTodos(list, "completed", "Buy")).toEqual([]);
  });
});

describe("parseStatus", () => {
  it("accepts known tabs and falls back to all", () => {
    expect(parseStatus("active")).toBe("active");
    expect(parseStatus("completed")).toBe("completed");
    expect(parseStatus("archived")).toBe("all");
    expect(parseStatus(null)).toBe("all");
  });
});

describe("parseLimit", () => {
  it("uses the default for missing or non-numeric values", () => {
    expect(parseLimit(null)).toBe(DEFAULT_LIMIT);
    expect(parseLimit("")).toBe(DEFAULT_LIMIT);
    expect(parseLimit("ten")).toBe(DEFAULT_LIMIT);
  });

  it("rounds down and caps at the maximum", () => {
    expect(parseLimit("20")).toBe(20);
    expect(parseLimit("20.9")).toBe(20);
    expect(parseLimit("5000")).toBe(MAX_LIMIT);
  });
});

describe("parseListQuery", () => {
  it("trims the search text and caps its length", () => {
    const query = parseListQuery(new URLSearchParams({ q: `  ${"a".repeat(150)}  ` }));
    expect(query.q).toHaveLength(100);
    expect(query.status).toBe("all");
    expect(query.limit).toBe(DEFAULT_LIMIT);
  });
});

describe("summarize and isAllDone", () => {
  it("counts open and finished todos", () => {
    expect(summarize([groceries, report])).toMatchObject({ total: 2, active: 1, completed: 1 });
  });

  it("is not all done for an empty list", () => {
    expect(isAllDone([])).toBe(false);
    expect(summarize([]).allDone).toBe(false);
  });

  it("is all done when every todo is completed", () => {
    expect(isAllDone([report, todo("File taxes", true)])).toBe(true);
  });

  it("is not all done when nothing is completed", () => {
    expect(isAllDone([groceries])).toBe(false);
  });
});
