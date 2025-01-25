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

export const useWordleStore = create<WordleStore>((set, get) => ({
  allWords: new Set(),
  remainingWords: null,
  guesses: [],
  settings: {
    hardMode: false,
    expandedMode: false,
  },
  reset: () => {
    set({
      remainingWords: null,
      guesses: [],
    });
  },
  async addWord(word: string) {
    await acceptedWordsPromise;
    if (!get().allWords.has(normalizeHebrew(word))) {
      return false;
    }
    const { remainingWords, coloring } = await getBestColoring(
      word,
      get().remainingWords,
    );
    set(({ guesses }) => ({
      guesses: [...guesses, { word, coloring }],
      remainingWords: new Set(remainingWords),
    }));
    return true;
  },
  setSettings(value) {
    set(({ settings }) => ({
      settings: { ...settings, ...value },
    }));
  },
}));
