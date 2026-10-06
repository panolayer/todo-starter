"use client";

import { LOCALES, LOCALE_NAMES, type Locale } from "@/lib/i18n";
import { THEMES, type Theme } from "@/lib/settings";
import { PRIORITIES, type Priority } from "@/lib/types";
import { useSettings, useT } from "./SettingsProvider";

interface Props {
  onClose: () => void;
}

// Preferences for this browser. Every change is saved as soon as it is made,
// so there is no Save button.
export function SettingsPanel({ onClose }: Props) {
  const { settings, updateSettings } = useSettings();
  const t = useT();

  return (
    <section className="settings" aria-labelledby="settings-heading">
      <div className="settings-header">
        <h2 id="settings-heading">{t("settings.heading")}</h2>
        <button className="text-button" type="button" onClick={onClose}>
          {t("settings.close")}
        </button>
      </div>
      <div className="settings-field">
        <label className="field-label" htmlFor="settings-theme">
          {t("settings.theme")}
        </label>
        <select
          id="settings-theme"
          className="add-select"
          value={settings.theme}
          onChange={(e) => updateSettings({ theme: e.target.value as Theme })}
        >
          {THEMES.map((theme) => (
            <option key={theme} value={theme}>
              {t(`theme.${theme}`)}
            </option>
          ))}
        </select>
      </div>
      <div className="settings-field">
        <label className="field-label" htmlFor="settings-language">
          {t("settings.language")}
        </label>
        <select
          id="settings-language"
          className="add-select"
          value={settings.language}
          onChange={(e) => updateSettings({ language: e.target.value as Locale })}
        >
          {LOCALES.map((locale) => (
            <option key={locale} value={locale} lang={locale}>
              {LOCALE_NAMES[locale]}
            </option>
          ))}
        </select>
      </div>
      <div className="settings-field">
        <label className="field-label" htmlFor="settings-priority">
          {t("settings.defaultPriority")}
        </label>
        <select
          id="settings-priority"
          className="add-select"
          value={settings.defaultPriority}
          onChange={(e) => updateSettings({ defaultPriority: e.target.value as Priority })}
        >
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {t(`priority.${p}`)}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}
