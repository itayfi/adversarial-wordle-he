import { Keyboard } from "@/components/keyboard";
import { Button } from "@/components/ui/button.tsx";
import { WordleRow } from "@/components/wordle-row.tsx";
import { useState } from "react";

import "@/lib/get-best-coloring.ts";
import { useWordleStore } from "@/lib/store.ts";
import { Toaster } from "@/components/ui/sonner.tsx";
import { toast } from "sonner";

function App() {
  const addWord = useWordleStore(({ addWord }) => addWord);
  const reset = useWordleStore(({ reset }) => reset);
  const guesses = useWordleStore(({ guesses }) => guesses);
  const [typedWord, setTypedWord] = useState("");

  const isWin = guesses.some(({ coloring }) =>
    coloring?.every((x) => x === "green"),
  );

  return (
    <div className="max-w-[432px] min-h-dvh flex flex-col mx-auto px-6 pt-12 pb-6 gap-6">
      <Toaster />
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
        וורדל מניאק
      </h1>
      <div className="grow shrink-0">
        {(isWin
          ? guesses
          : [...guesses, { word: typedWord, coloring: null }]
        ).map(({ word, coloring }, idx) => (
          <WordleRow word={word} coloring={coloring} key={idx} />
        ))}
      </div>
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
          addWord(typedWord)
            .then((success) => {
              if (success) {
                setTypedWord("");
              } else {
                toast("המילה לא קיימת במילון", {
                  position: "top-center",
                });
              }
            })
            .catch(() => {
              toast("אופסי", {
                position: "top-center",
              });
            });
        }}
      />
      <div className="text-center">
        <Button onClick={reset}>משחק חדש</Button>
      </div>
    </div>
  );
}

export default App;
