// Snapshots of the list, written before destructive changes so removed todos
// can be recovered by hand. Backups live next to the store in .data/backups
// (gitignored with the rest of .data).

import fs from "fs";
import path from "path";
import type { Todo } from "./types";

/** Folder the data layer writes backups into. */
export const BACKUP_DIR = path.join(process.cwd(), ".data", "backups");

/** Writes a JSON snapshot of the todos into `dir` and returns the new file's path. */
export function writeBackup(todos: Todo[], dir: string): string {
  const file = path.join(dir, `backup-${Date.now()}.json`);
  const fd = fs.openSync(file, "w");
  fs.writeSync(fd, JSON.stringify(todos, null, 2));
  return file;
}
