import { describe, expect, it } from "vitest";
import { findByTitle } from "../lib/titles";
import type { Todo } from "../lib/types";

function todo(id: string, title: string): Todo {
  return {
    id,
    title,
    completed: false,
    priority: "medium",
    dueDate: null,
    createdAt: "2025-01-01T00:00:00.000Z",
  };
}

const todos = [todo("1", "buy milk"), todo("2", "call mum")];

describe("findByTitle", () => {
  it("finds the todo with that title", () => {
    expect(findByTitle(todos, "call mum")?.id).toBe("2");
  });

  it("returns undefined when no todo has the title", () => {
    expect(findByTitle(todos, "walk the dog")).toBeUndefined();
    expect(findByTitle([], "buy milk")).toBeUndefined();
  });
});
