import { describe, expect, it } from "vitest";
import { firstTodos } from "../lib/export";
import type { Todo } from "../lib/types";

function todo(id: string): Todo {
  return {
    id,
    title: `Todo ${id}`,
    completed: false,
    priority: "medium",
    dueDate: null,
    createdAt: "2025-01-01T00:00:00.000Z",
  };
}

const todos = [todo("1"), todo("2"), todo("3")];

describe("firstTodos", () => {
  it("keeps the first `limit` todos, in order", () => {
    expect(firstTodos(todos, new URLSearchParams({ limit: "2" })).map((t) => t.id)).toEqual(["1", "2"]);
  });

  it("returns every todo when the limit is larger than the list", () => {
    expect(firstTodos(todos, new URLSearchParams({ limit: "10" }))).toHaveLength(3);
  });
});
