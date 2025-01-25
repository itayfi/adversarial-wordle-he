import { create } from "zustand/react";
import { calculateWordleColoring } from "@/lib/wordle-utils.ts";
import { getBestColoring } from "@/lib/get-best-coloring.ts";

type WordleStore = {
  allWords: Set<string>;
  remainingWords: Set<string> | null;
  guesses: {
    word: string;
    coloring: ReturnType<typeof calculateWordleColoring> | null;
  }[];
  reset(): void;
  addWord(word: string): Promise<boolean>;
};

const acceptedWordsPromise = import("@/assets/accepted-words.json").then(
  (module) => {
    useWordleStore.setState({ allWords: new Set(module.default) });
  },
);

export const useWordleStore = create<WordleStore>((set, get) => ({
  allWords: new Set(),
  remainingWords: null,
  guesses: [],
  reset: () => {
    set({
      remainingWords: null,
      guesses: [],
    });
  },
  async addWord(word: string) {
    await acceptedWordsPromise;
    if (!get().allWords.has(word)) {
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
}));
