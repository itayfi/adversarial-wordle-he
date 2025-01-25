import { create } from "zustand/react";
import {
  calculateWordleColoring,
  normalizeHebrew,
} from "@/lib/wordle-utils.ts";
import { getBestColoring } from "@/lib/get-best-coloring.ts";

type Settings = {
  hardMode: boolean;
  expandedMode: boolean;
};
type WordleStore = {
  allWords: Set<string>;
  remainingWords: Set<string> | null;
  guesses: {
    word: string;
    coloring: ReturnType<typeof calculateWordleColoring> | null;
  }[];
  settings: Settings;
  reset(): void;
  addWord(word: string): Promise<boolean>;
  setSettings(settings: Partial<Settings>): void;
};

const acceptedWordsPromise = import("@/assets/accepted-words.json").then(
  (module) => {
    useWordleStore.setState({
      allWords: new Set(module.default.map((w) => normalizeHebrew(w))),
    });
  },
);

const DEFAULT_SETTINGS = {
  hardMode: false,
  expandedMode: false,
};
const getDefaultSettings = () => {
  const raw = localStorage.getItem("settings");
  if (raw === null) {
    return DEFAULT_SETTINGS;
  }
  let parsed = null;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    return DEFAULT_SETTINGS;
  }
  if (parsed === null || typeof parsed !== "object") {
    return DEFAULT_SETTINGS;
  }
  if (!("hardMode" in parsed) || !("expandedMode" in parsed)) {
    return DEFAULT_SETTINGS;
  }
  const hardMode = parsed.hardMode;
  const expandedMode = parsed.expandedMode;
  if (typeof hardMode !== "boolean" || typeof expandedMode !== "boolean") {
    return DEFAULT_SETTINGS;
  }
  return { hardMode, expandedMode };
};

export const useWordleStore = create<WordleStore>((set, get) => ({
  allWords: new Set(),
  remainingWords: null,
  guesses: [],
  settings: getDefaultSettings(),
  reset: () => {
    set({
      remainingWords: null,
      guesses: [],
    });
  },
  async addWord(word: string) {
    await acceptedWordsPromise;
    const allWordsSet = get().allWords;
    if (!allWordsSet.has(normalizeHebrew(word))) {
      return false;
    }
    const { remainingWords, coloring } = await getBestColoring(
      word,
      get().remainingWords ??
        (get().settings.expandedMode ? allWordsSet : null),
    );
    set(({ guesses }) => ({
      guesses: [...guesses, { word, coloring }],
      remainingWords: new Set(remainingWords),
    }));
    return true;
  },
  setSettings(value) {
    set(({ settings }) => {
      const newSettings = { ...settings, ...value };
      localStorage.setItem("settings", JSON.stringify(newSettings));
      return {
        settings: newSettings,
      };
    });
  },
}));
