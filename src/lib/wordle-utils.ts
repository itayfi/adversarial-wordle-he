/**
 * Normalize Hebrew words by replacing final letters with their standard forms.
 * @param word - The Hebrew word (string).
 * @return Normalized word (string).
 */
export function normalizeHebrew(word: string): string {
  return word
    .replace(/ם/g, "מ")
    .replace(/ף/g, "פ")
    .replace(/ן/g, "נ")
    .replace(/ך/g, "כ")
    .replace(/ץ/g, "צ");
}

/**
 * Convert Hebrew letter to final form when needed.
 * @param letter The Hebrew letter (string)
 * @return Final form (string).
 */
export function finalizeLetter(letter: string) {
  return letter
    .replace(/מ/g, "ם")
    .replace(/פ/g, "ף")
    .replace(/נ/g, "ן")
    .replace(/כ/g, "ך")
    .replace(/צ/g, "ץ");
}

/**
 * Calculate the coloring for a Wordle guess.
 * @param guess - The guessed word (string).
 * @param target - The target word (string).
 * @return An array of colors ('green', 'yellow', 'gray') for each letter in the guess.
 */
export function calculateWordleColoring(
  guess: string,
  target: string,
): ("green" | "yellow" | "gray")[] {
  guess = normalizeHebrew(guess);
  target = normalizeHebrew(target);

  if (guess.length !== target.length) {
    throw new Error("Guess and target must be the same length.");
  }

  const result: ("green" | "yellow" | "gray")[] = Array(guess.length).fill(
    "gray",
  );
  const targetLetterCounts: Record<string, number> = {};

  // First pass: assign "green" for correct letters in correct positions
  for (let i = 0; i < target.length; i++) {
    if (guess[i] === target[i]) {
      result[i] = "green";
    } else {
      targetLetterCounts[target[i]] = (targetLetterCounts[target[i]] || 0) + 1;
    }
  }

  // Second pass: assign "yellow" for correct letters in wrong positions
  for (let i = 0; i < guess.length; i++) {
    if (
      result[i] === "gray" &&
      targetLetterCounts[guess[i]] &&
      targetLetterCounts[guess[i]] > 0
    ) {
      result[i] = "yellow";
      targetLetterCounts[guess[i]] -= 1;
    }
  }

  return result;
}
