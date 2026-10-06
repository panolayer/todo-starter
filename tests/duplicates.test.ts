import { describe, expect, it } from "vitest";
import { duplicateTitles } from "../lib/duplicates";
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

describe("duplicateTitles", () => {
  it("is empty when every title is different", () => {
    expect(duplicateTitles([todo("1", "Buy milk"), todo("2", "Call mum")])).toEqual([]);
    expect(duplicateTitles([])).toEqual([]);
  });

  it("lists a repeated title once, ignoring case and surrounding spaces", () => {
    const todos = [
      todo("1", "Buy milk"),
      todo("2", "Call mum"),
      todo("3", " buy MILK "),
      todo("4", "Buy milk"),
    ];
    expect(duplicateTitles(todos)).toEqual(["buy milk"]);
  });

  it("keeps the order in which titles first repeat", () => {
    const todos = [todo("1", "a"), todo("2", "b"), todo("3", "b"), todo("4", "a")];
    expect(duplicateTitles(todos)).toEqual(["b", "a"]);
  });
});
