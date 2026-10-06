"use client";

import { THEMES, type Theme } from "@/lib/settings";
import { PRIORITIES, type Priority } from "@/lib/types";
import { useSettings } from "./SettingsProvider";

const THEME_LABELS: Record<Theme, string> = {
  system: "Match system",
  light: "Light",
  dark: "Dark",
};

const PRIORITY_LABELS: Record<Priority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

interface Props {
  onClose: () => void;
}

// Preferences for this browser. Every change is saved as soon as it is made,
// so there is no Save button.
export function SettingsPanel({ onClose }: Props) {
  const { settings, updateSettings } = useSettings();

  return (
    <section className="settings" aria-labelledby="settings-heading">
      <div className="settings-header">
        <h2 id="settings-heading">Settings</h2>
        <button className="text-button" type="button" onClick={onClose}>
          Done
        </button>
      </div>
      <div className="settings-field">
        <label className="field-label" htmlFor="settings-theme">
          Theme
        </label>
        <select
          id="settings-theme"
          className="add-select"
          value={settings.theme}
          onChange={(e) => updateSettings({ theme: e.target.value as Theme })}
        >
          {THEMES.map((theme) => (
            <option key={theme} value={theme}>
              {THEME_LABELS[theme]}
            </option>
          ))}
        </select>
      </div>
      <div className="settings-field">
        <label className="field-label" htmlFor="settings-priority">
          Default priority for new todos
        </label>
        <select
          id="settings-priority"
          className="add-select"
          value={settings.defaultPriority}
          onChange={(e) => updateSettings({ defaultPriority: e.target.value as Priority })}
        >
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {PRIORITY_LABELS[p]}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}
