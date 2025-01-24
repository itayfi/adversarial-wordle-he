import { cn } from "@/lib/utils.ts";
import { motion } from "motion/react";
import { calculateWordleColoring, finalizeLetter } from "@/lib/wordle-utils.ts";

const colors = {
  green: "#047857",
  yellow: "#facc15",
  gray: "#737373",
};

const WordleLetter = ({
  letter,
  mode,
  index,
}: {
  letter: string;
  mode: null | "green" | "yellow" | "gray";
  index: number;
}) => {
  return (
    <motion.div
      layout
      transition={{ delay: 0.2 * index, duration: 0.5 }}
      initial={{
        backgroundColor: "#f5f5f4",
        color: "black",
      }}
      animate={{
        rotateY: mode === null ? 0 : 360,
        backgroundColor: mode === null ? "#f5f5f4" : colors[mode],
        color: mode === null ? "black" : "white",
      }}
      className={cn(
        "size-12 leading-none text-4xl rounded justify-center items-center flex font-medium",
      )}
    >
      {letter}
    </motion.div>
  );
};

export const WordleRow = ({
  word,
  coloring,
}: {
  word: string;
  coloring: ReturnType<typeof calculateWordleColoring> | null;
}) => {
  const letters = new Array(5)
    .fill("")
    .map((_, i) => word.charAt(i))
    .map((letter, i) => (i === 4 ? finalizeLetter(letter) : letter));
  return (
    <div className="flex justify-center gap-1 mt-2">
      {letters.map((letter, i) => (
        <WordleLetter
          key={i}
          letter={letter}
          mode={coloring?.[i] ?? null}
          index={i}
        />
      ))}
    </div>
  );
};
