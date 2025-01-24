import { Button } from "@/components/ui/button.tsx";
import { CornerDownLeft, Delete } from "lucide-react";
import { useEffect } from "react";

const REGEX_HEBREW_SINGLE = /^[א-ת]$/;

export const Keyboard = ({
  onKeyDown,
  onBackspace,
  onEnter,
}: {
  onKeyDown: (key: string) => void;
  onEnter: () => void;
  onBackspace: () => void;
}) => {
  const createKeyHandler = (key: string) => () => onKeyDown(key);

  useEffect(() => {
    const abort = new AbortController();
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
    return () => abort.abort();
  }, [onBackspace, onEnter, onKeyDown]);

  return (
    <div className="grid grid-cols-[repeat(19,1fr)] gap-2 max-w-96">
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

const KeyboardButton = ({
  letter,
  createKeyHandler,
}: {
  letter: string;
  createKeyHandler: (letter: string) => () => void;
}) => {
  return (
    <Button
      onClick={createKeyHandler(letter)}
      className="col-span-2 text-lg"
      variant="secondary"
    >
      {letter}
    </Button>
  );
};
