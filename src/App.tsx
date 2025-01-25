import { Keyboard } from "@/components/keyboard";
import { Button } from "@/components/ui/button.tsx";
import { WordleRow } from "@/components/wordle-row.tsx";
import { useState } from "react";

import "@/lib/get-best-coloring.ts";
import { useWordleStore } from "@/lib/store.ts";

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
          setTypedWord("");
          addWord(typedWord).then((success) => {
            if (!success) {
              alert("מילה לא תקינה");
            }
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
