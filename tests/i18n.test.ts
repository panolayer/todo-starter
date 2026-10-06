import { describe, expect, it } from "vitest";
import { LOCALES, formatDay, isLocale, translate } from "../lib/i18n";

describe("translate", () => {
  it("looks up text in the requested language", () => {
    expect(translate("en", "form.add")).toBe("Add");
    expect(translate("fr", "form.add")).toBe("Ajouter");
  });

  it("fills placeholders and leaves unknown ones as written", () => {
    expect(translate("en", "app.leftToDo", { count: 3 })).toBe("3 left to do");
    expect(translate("fr", "app.leftToDo", { count: 3 })).toBe("À faire : 3");
    expect(translate("en", "app.leftToDo")).toBe("{count} left to do");
  });
});

describe("isLocale", () => {
  it("accepts only supported languages", () => {
    for (const locale of LOCALES) expect(isLocale(locale)).toBe(true);
    expect(isLocale("de")).toBe(false);
    expect(isLocale(undefined)).toBe(false);
  });
});

describe("formatDay", () => {
  it("formats a calendar day without shifting it across time zones", () => {
    expect(formatDay("en", "2025-03-04")).toBe("Mar 4");
    expect(formatDay("fr", "2025-03-04")).toBe("4 mars");
  });
});
