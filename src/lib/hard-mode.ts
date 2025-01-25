import { useWordleStore } from "@/lib/store.ts";
import {
  calculateWordleColoring,
  normalizeHebrew,
} from "@/lib/wordle-utils.ts";

export const isValidInHardMode = (word: string) => {
  const state = useWordleStore.getState();
  if (state.settings.expandedMode && state.remainingWords) {
    return state.remainingWords.has(normalizeHebrew(word));
  }
  for (const guess of state.guesses) {
    const newColoring = calculateWordleColoring(guess.word, word);
    if (
      newColoring.some((letterColor, i) => guess.coloring?.[i] !== letterColor)
    ) {
      return false;
    }
  }
  return true;
};
