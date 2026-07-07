// A tiny JSON-file-backed store. This is a stand-in for a real database — it
// keeps the app's data layer clean and inspectable without any external
// dependencies. Todos are persisted to `.data/todos.json` (gitignored); on
// first run the file is created from the seed below.

import { promises as fs } from "fs";
import path from "path";
import type { Todo } from "./types";

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "todos.json");

const seed: Todo[] = [
  {
    id: "seed-explore",
    title: "Explore this codebase in the Architecture view",
    completed: true,
    createdAt: new Date("2024-01-01T09:00:00Z").toISOString(),
  },
  {
    id: "seed-rule",
    title: "Create your first rule in the Guardian tab",
    completed: false,
    createdAt: new Date("2024-01-02T09:00:00Z").toISOString(),
  },
  {
    id: "seed-fix",
    title: "Fix a failing rule with the Companion agent",
    completed: false,
    createdAt: new Date("2024-01-03T09:00:00Z").toISOString(),
  },
];

async function ensureFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify(seed, null, 2), "utf8");
  }
}

/** Read every todo from the store. */
export async function readAll(): Promise<Todo[]> {
  await ensureFile();
  const raw = await fs.readFile(DATA_FILE, "utf8");
  return JSON.parse(raw) as Todo[];
}

/** Overwrite the store with the given todos. */
export async function writeAll(todos: Todo[]): Promise<void> {
  await ensureFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(todos, null, 2), "utf8");
}
