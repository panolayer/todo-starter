import { describe, expect, it } from "vitest";
import {
  DEFAULT_SETTINGS,
  SETTINGS_STORAGE_KEY,
  loadSettings,
  parseSettings,
  saveSettings,
} from "../lib/settings";

function memoryStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
  };
}

describe("default settings", () => {
  it("follow the system theme, use English and medium priority", () => {
    expect(DEFAULT_SETTINGS).toEqual({ theme: "system", language: "en", defaultPriority: "medium" });
  });
});

describe("parseSettings", () => {
  it("returns the defaults when nothing was saved", () => {
    expect(parseSettings(null)).toEqual(DEFAULT_SETTINGS);
  });

  it("returns the defaults for unreadable saves", () => {
    expect(parseSettings("{not json")).toEqual(DEFAULT_SETTINGS);
    expect(parseSettings("42")).toEqual(DEFAULT_SETTINGS);
    expect(parseSettings("null")).toEqual(DEFAULT_SETTINGS);
  });

  it("keeps valid fields and replaces invalid ones one by one", () => {
    const raw = JSON.stringify({ theme: "dark", language: "de", defaultPriority: "high" });
    expect(parseSettings(raw)).toEqual({ theme: "dark", language: "en", defaultPriority: "high" });
  });

  it("does not share the defaults object", () => {
    const settings = parseSettings(null);
    settings.theme = "dark";
    expect(DEFAULT_SETTINGS.theme).toBe("system");
  });
});

describe("loadSettings and saveSettings", () => {
  it("round-trip through storage", () => {
    const storage = memoryStorage();
    saveSettings(storage, { theme: "light", language: "fr", defaultPriority: "low" });
    expect(loadSettings(storage)).toEqual({ theme: "light", language: "fr", defaultPriority: "low" });
    expect(storage.getItem(SETTINGS_STORAGE_KEY)).not.toBeNull();
  });

  it("fall back gracefully when storage throws", () => {
    const broken = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("full");
      },
    };
    expect(loadSettings(broken)).toEqual(DEFAULT_SETTINGS);
    expect(() => saveSettings(broken, { ...DEFAULT_SETTINGS })).not.toThrow();
  });
});
