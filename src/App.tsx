import { Keyboard } from "@/components/keyboard";
import { Button } from "@/components/ui/button.tsx";
import { WordleRow } from "@/components/wordle-row.tsx";
import { SyntheticEvent, useState } from "react";

import "@/lib/get-best-coloring.ts";
import { useWordleStore } from "@/lib/store.ts";
import { Toaster } from "@/components/ui/sonner.tsx";
import { toast } from "sonner";
import { cn } from "@/lib/utils.ts";
import { SettingsDialog } from "@/components/settings.tsx";
import { isValidInHardMode } from "@/lib/hard-mode.ts";
import ReactConfetti from "react-confetti";
import { motion } from "motion/react";
import { RotateCcw, Share2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip.tsx";

function App() {
  const addWord = useWordleStore(({ addWord }) => addWord);
  const reset = useWordleStore(({ reset }) => reset);
  const guesses = useWordleStore(({ guesses }) => guesses);
  const hardMode = useWordleStore(({ settings: { hardMode } }) => hardMode);
  const [typedWord, setTypedWord] = useState("");

  const isWin = guesses.some(({ coloring }) =>
    coloring?.every((x) => x === "green"),
  );

  const onShare = () => {
    const emojis = guesses
      .map(
        ({ coloring }) =>
          coloring
            ?.map(
              (c) =>
                ({
                  green: "🟩",
                  yellow: "🟨",
                  gray: "⬜",
                })[c],
            )
            .join("") ?? "",
      )
      .join("\n");
    void navigator.share({
      text: `ניצחתי את המניאק ב־${guesses.length} צעדים\n${emojis}\n\n${location.href}`,
    });
  };
  const onReset = (event: SyntheticEvent<HTMLElement>) => {
    reset();
    setTypedWord("");
    event.currentTarget.blur();
  };

  return (
    <TooltipProvider>
      <Toaster position="top-center" />
      {isWin ? <ReactConfetti recycle={false} /> : null}
      <div className="max-w-[432px] min-h-dvh flex flex-col mx-auto px-6 pb-6 gap-6">
        <div className="border-b flex flex-row">
          <SettingsDialog />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="ms-auto"
                onClick={onReset}
              >
                <RotateCcw />
              </Button>
            </TooltipTrigger>
            <TooltipContent>משחק חדש</TooltipContent>
          </Tooltip>
        </div>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
          וורדל מניאק
        </h1>
        <div className={cn("shrink-0", { grow: !isWin })}>
          {(isWin
            ? guesses
            : [...guesses, { word: typedWord, coloring: null }]
          ).map(({ word, coloring }, idx) => (
            <WordleRow word={word} coloring={coloring} key={idx} />
          ))}
        </div>
        {isWin ? (
          <div className="grow">
            נו, ניצחת תוך {guesses.length} צעדים.
            {guesses.length < 8
              ? " זה כנראה היה מזל."
              : " אם בכלל אפשר לקרוא לזה ניצחון."}
          </div>
        ) : null}
        <motion.div
          className="flex justify-center gap-2"
          initial={{ opacity: 0, translateY: "100%" }}
          animate={
            isWin
              ? { opacity: 1, translateY: 0 }
              : { opacity: 0, translateY: "100%" }
          }
          transition={{ duration: 0.4, type: "spring" }}
        >
          <Button variant="outline" onClick={onShare}>
            <Share2 />
            שיתוף
          </Button>
          <Button variant="outline" onClick={onReset}>
            <RotateCcw />
            משחק חדש
          </Button>
        </motion.div>
        <Keyboard
          disabled={isWin}
          onKeyDown={(key) =>
            setTypedWord((word) => {
              if (word.length >= 5) {
                return word;
              }
              return `${word}${key}`;
            })
          }
          onBackspace={() => setTypedWord((word) => word.slice(0, -1))}
          onEnter={() => {
            if (typedWord.length < 5) {
              return;
            }
            if (hardMode && !isValidInHardMode(typedWord)) {
              toast("ביקשת מצב קשה? אז המילה לא מתאימה");
              return;
            }
            addWord(typedWord)
              .then((success) => {
                if (success) {
                  setTypedWord("");
                } else {
                  toast("לא להמציא לי כאן מילים");
                }
              })
              .catch(() => {
                toast("הבאג לא אצלי הוא אצלך");
              });
          }}
        />
      </div>
    </TooltipProvider>
  );
}

export default App;
