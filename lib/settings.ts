// User preferences, saved in this browser's localStorage. Settings never go to
// the server: they belong to the person at this browser, not to the list.

import { isPriority, type Priority } from "./types";

export type Theme = "system" | "light" | "dark";

/** Every theme choice, in display order. */
export const THEMES: readonly Theme[] = ["system", "light", "dark"];

export interface Settings {
  theme: Theme;
  /** Priority preselected on the new-todo form. */
  defaultPriority: Priority;
}

/** localStorage key the settings are saved under. */
export const SETTINGS_STORAGE_KEY = "todo-starter.settings";

/**
 * What everyone starts with before saving anything: follow the system's
 * light/dark theme, and preselect medium priority for new todos.
 */
export const DEFAULT_SETTINGS: Readonly<Settings> = {
  theme: "system",
  defaultPriority: "medium",
};

function isTheme(value: unknown): value is Theme {
  return typeof value === "string" && (THEMES as readonly string[]).includes(value);
}

/**
 * Turn the saved JSON (or null when nothing was saved) into complete settings.
 * Each field that is missing or invalid falls back to its default on its own,
 * so a partly damaged save keeps the fields that are still good.
 */
export function parseSettings(raw: string | null): Settings {
  if (raw === null) return { ...DEFAULT_SETTINGS };
  let saved: unknown;
  try {
    saved = JSON.parse(raw);
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
  if (typeof saved !== "object" || saved === null) return { ...DEFAULT_SETTINGS };
  const fields = saved as Record<string, unknown>;
  return {
    theme: isTheme(fields.theme) ? fields.theme : DEFAULT_SETTINGS.theme,
    defaultPriority: isPriority(fields.defaultPriority)
      ? fields.defaultPriority
      : DEFAULT_SETTINGS.defaultPriority,
  };
}

/**
 * Load settings from storage. Returns the defaults when nothing has been
 * saved yet or when storage cannot be read (for example, blocked cookies).
 */
export function loadSettings(storage: Pick<Storage, "getItem">): Settings {
  try {
    return parseSettings(storage.getItem(SETTINGS_STORAGE_KEY));
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

/**
 * Save settings to storage. A failed write (storage full or blocked) is
 * ignored: the new settings still apply until the page is closed.
 */
export function saveSettings(storage: Pick<Storage, "setItem">, settings: Settings): void {
  try {
    storage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Keep the in-memory settings; there is nowhere to persist them.
  }
}
