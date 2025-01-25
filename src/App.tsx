import { Keyboard } from "@/components/keyboard";
import { Button } from "@/components/ui/button.tsx";
import { WordleRow } from "@/components/wordle-row.tsx";
import { useState } from "react";

import "@/lib/get-best-coloring.ts";
import { useWordleStore } from "@/lib/store.ts";
import { Toaster } from "@/components/ui/sonner.tsx";
import { toast } from "sonner";
import { cn } from "@/lib/utils.ts";
import { SettingsDialog } from "@/components/settings.tsx";
import { isValidInHardMode } from "@/lib/hard-mode.ts";
import ReactConfetti from "react-confetti";

function App() {
  const addWord = useWordleStore(({ addWord }) => addWord);
  const reset = useWordleStore(({ reset }) => reset);
  const guesses = useWordleStore(({ guesses }) => guesses);
  const hardMode = useWordleStore(({ settings: { hardMode } }) => hardMode);
  const [typedWord, setTypedWord] = useState("");

  const isWin = guesses.some(({ coloring }) =>
    coloring?.every((x) => x === "green"),
  );

  return (
    <>
      <Toaster position="top-center" />
      {isWin ? <ReactConfetti recycle={false} /> : null}
      <div className="max-w-[432px] min-h-dvh flex flex-col mx-auto px-6 pb-6 gap-6">
        <div className="border-b">
          <SettingsDialog />
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
              : " נקווה שילך יותר טוב בפעם הבאה."}
          </div>
        ) : null}
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
        <div className="text-center">
          <Button
            onClick={(event) => {
              reset();
              event.currentTarget.blur();
            }}
          >
            משחק חדש
          </Button>
        </div>
      </div>
    </>
  );
}

export default App;
