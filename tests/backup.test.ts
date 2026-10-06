import { mkdtempSync, readFileSync, rmSync } from "fs";
import { tmpdir } from "os";
import path from "path";
import { afterEach, describe, expect, it } from "vitest";
import { writeBackup } from "../lib/backup";
import type { Todo } from "../lib/types";

const todos: Todo[] = [
  {
    id: "a",
    title: "Buy milk",
    completed: true,
    priority: "low",
    dueDate: "2025-03-04",
    createdAt: "2025-01-01T00:00:00.000Z",
  },
];

let dir: string | undefined;

afterEach(() => {
  if (dir) rmSync(dir, { recursive: true, force: true });
  dir = undefined;
});

describe("writeBackup", () => {
  it("writes the todos as JSON into the given folder", () => {
    dir = mkdtempSync(path.join(tmpdir(), "todo-backup-"));
    const file = writeBackup(todos, dir);
    expect(path.dirname(file)).toBe(dir);
    expect(path.basename(file)).toMatch(/^backup-\d+\.json$/);
    expect(JSON.parse(readFileSync(file, "utf8"))).toEqual(todos);
  });
});
