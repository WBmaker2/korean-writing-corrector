import { useCallback, useState } from 'react';
import type { DictionaryEntry } from '../types';

const LS = 'kwc:settings';

export interface Settings {
  ignoredRuleIds: string[];
  userDictionary: DictionaryEntry[];
  debounceMs: number;
  minConfidence: number;
}

const DEFAULT: Settings = { ignoredRuleIds: [], userDictionary: [], debounceMs: 300, minConfidence: 0 };

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(LS);
    if (!raw) return DEFAULT;
    return { ...DEFAULT, ...JSON.parse(raw) };
  } catch {
    return DEFAULT;
  }
}

export function saveSettings(s: Settings) {
  localStorage.setItem(LS, JSON.stringify(s));
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      saveSettings(next);
      return next;
    });
  }, []);
  return { settings, update };
}
