import { Keyboard } from "@/components/keyboard";
import { Button } from "@/components/ui/button.tsx";

function App() {
  return (
    <div className="max-w-[432px] min-h-dvh flex flex-col mx-auto px-6 pt-12 pb-6">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
        וורדל מניאק
      </h1>
      <p className="leading-7 [&:not(:first-child)]:mt-6 grow shrink-0">
        כאן יהיה תוכן
      </p>
      <Keyboard
        onKeyDown={(key) => console.log(key)}
        onBackspace={() => console.log("Backspace")}
        onEnter={() => console.log("Enter")}
      />
      <p className="text-center leading-7 [&:not(:first-child)]:mt-6 shrink-0">
        <Button>משחק חדש</Button>
      </p>
    </div>
  );
}

export default App;
