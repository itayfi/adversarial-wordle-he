import { Button } from "@/components/ui/button.tsx";
import { CornerDownLeft, Delete } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils.ts";
import { useWordleStore } from "@/lib/store.ts";
import { normalizeHebrew } from "@/lib/wordle-utils.ts";

const REGEX_HEBREW_SINGLE = /^[א-ת]$/;

export const Keyboard = ({
  onKeyDown,
  onBackspace,
  onEnter,
  disabled,
}: {
  onKeyDown: (key: string) => void;
  onEnter: () => void;
  onBackspace: () => void;
  disabled: boolean;
}) => {
  const createKeyHandler = (key: string) => () => onKeyDown(key);

  useEffect(() => {
    const abort = new AbortController();
    if (!disabled) {
      document.body.addEventListener(
        "keydown",
        (event) => {
          if (REGEX_HEBREW_SINGLE.test(event.key)) {
            onKeyDown(event.key);
          }
          if (event.key === "Backspace") {
            onBackspace();
          }
          if (event.key === "Enter") {
            onEnter();
          }
        },
        {
          signal: abort.signal,
        },
      );
    }
    return () => abort.abort();
  }, [disabled, onBackspace, onEnter, onKeyDown]);

  return (
    <div
      className={cn("grid grid-cols-[repeat(19,1fr)] gap-2 max-w-96", {
        "pointer-events-none": disabled,
      })}
    >
      {/*Row 1*/}
      <Button className="col-span-3" variant="secondary" onClick={onBackspace}>
        <Delete />
      </Button>
      <KeyboardButton letter="פ" createKeyHandler={createKeyHandler} />
      <KeyboardButton letter="ו" createKeyHandler={createKeyHandler} />
      <KeyboardButton letter="ט" createKeyHandler={createKeyHandler} />
      <KeyboardButton letter="א" createKeyHandler={createKeyHandler} />
      <KeyboardButton letter="ר" createKeyHandler={createKeyHandler} />
      <KeyboardButton letter="ק" createKeyHandler={createKeyHandler} />
      <div className="col-span-4" />
      {/* Row 2*/}
      <div className="col-span-2" />
      <KeyboardButton letter="ל" createKeyHandler={createKeyHandler} />
      <KeyboardButton letter="ח" createKeyHandler={createKeyHandler} />
      <KeyboardButton letter="י" createKeyHandler={createKeyHandler} />
      <KeyboardButton letter="ע" createKeyHandler={createKeyHandler} />
      <KeyboardButton letter="כ" createKeyHandler={createKeyHandler} />
      <KeyboardButton letter="ג" createKeyHandler={createKeyHandler} />
      <KeyboardButton letter="ד" createKeyHandler={createKeyHandler} />
      <KeyboardButton letter="ש" createKeyHandler={createKeyHandler} />
      {/* Row 3*/}
      <Button className="col-span-3" variant="secondary" onClick={onEnter}>
        <CornerDownLeft />
      </Button>
      <KeyboardButton letter="ת" createKeyHandler={createKeyHandler} />
      <KeyboardButton letter="צ" createKeyHandler={createKeyHandler} />
      <KeyboardButton letter="מ" createKeyHandler={createKeyHandler} />
      <KeyboardButton letter="נ" createKeyHandler={createKeyHandler} />
      <KeyboardButton letter="ה" createKeyHandler={createKeyHandler} />
      <KeyboardButton letter="ב" createKeyHandler={createKeyHandler} />
      <KeyboardButton letter="ס" createKeyHandler={createKeyHandler} />
      <KeyboardButton letter="ז" createKeyHandler={createKeyHandler} />
    </div>
  );
};

const useLetterColor = (letter: string) => {
  const guesses = useWordleStore(({ guesses }) => guesses);
  const colors = guesses.flatMap(({ word, coloring }) => {
    const normalizedWord = normalizeHebrew(word);
    return coloring?.filter((_, i) => normalizedWord.charAt(i) === letter);
  });
  if (colors.includes("green")) {
    return "green";
  }
  if (colors.includes("yellow")) {
    return "yellow";
  }
  if (colors.includes("gray")) {
    return "gray";
  }
  return null;
};

const KeyboardButton = ({
  letter,
  createKeyHandler,
}: {
  letter: string;
  createKeyHandler: (letter: string) => () => void;
}) => {
  const color = useLetterColor(letter);

  return (
    <Button
      onClick={createKeyHandler(letter)}
      className={cn("col-span-2 text-lg transition-all duration-400", {
        "bg-emerald-700 hover:bg-emerald-700/80": color === "green",
        "bg-yellow-400 hover:bg-yellow-400/80": color === "yellow",
        "bg-neutral-500 hover:bg-neutral-500/80": color === "gray",
        "text-white": color !== null,
      })}
      variant="secondary"
    >
      {letter}
    </Button>
  );
};
