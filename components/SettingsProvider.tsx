"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { translate, type MessageKey } from "@/lib/i18n";
import { DEFAULT_SETTINGS, loadSettings, saveSettings, type Settings } from "@/lib/settings";

interface SettingsContextValue {
  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: { ...DEFAULT_SETTINGS },
  updateSettings: () => {},
});

// Holds the current settings for the whole page. The first render uses the
// defaults (the server cannot see localStorage); saved settings are applied
// right after the page mounts.
export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>({ ...DEFAULT_SETTINGS });

  useEffect(() => {
    setSettings(loadSettings(window.localStorage));
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = settings.theme;
  }, [settings.theme]);

  useEffect(() => {
    document.documentElement.lang = settings.language;
  }, [settings.language]);

  function updateSettings(patch: Partial<Settings>) {
    const next = { ...settings, ...patch };
    setSettings(next);
    saveSettings(window.localStorage, next);
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

/** The current settings and a function to change them. */
export function useSettings(): SettingsContextValue {
  return useContext(SettingsContext);
}

/** A translate function bound to the current language setting. */
export function useT(): (key: MessageKey, values?: Record<string, string | number>) => string {
  const { settings } = useSettings();
  return (key, values) => translate(settings.language, key, values);
}
