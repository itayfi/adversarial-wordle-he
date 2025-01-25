import {
  calculateWordleColoring,
  normalizeHebrew,
} from "@/lib/wordle-utils.ts";

const targetWordsPromise = import("@/assets/target-words.json").then(
  (module) => module.default,
);

export async function getBestColoring(
  guessWord: string,
  remainingWords?: Iterable<string> | null,
): Promise<{
  coloring: ("green" | "yellow" | "gray")[];
  remainingWords: string[];
}> {
  const guessResults: Record<string, string[]> = {};

  for (const targetWord of remainingWords ?? (await targetWordsPromise)) {
    const coloring = calculateWordleColoring(guessWord, targetWord)
      .map((color) => ({ gray: "0", yellow: "1", green: "2" })[color])
      .join("");
    const normalizedWord = normalizeHebrew(targetWord);

    if (!guessResults[coloring]) {
      guessResults[coloring] = [];
    }
    guessResults[coloring].push(normalizedWord);
  }

  let bestColoring = "";
  let bestWords: string[] = [];

  for (const [coloring, words] of Object.entries(guessResults)) {
    if (coloring === "22222" && Object.entries(guessResults).length > 1) {
      continue;
    }
    if (words.length > bestWords.length) {
      bestColoring = coloring;
      bestWords = words;
    }
  }

  return {
    coloring: bestColoring.split("").map(
      (c) =>
        (
          ({
            0: "gray",
            1: "yellow",
            2: "green",
          }) as const
        )[c]!,
    ),
    remainingWords: bestWords,
  };
}
