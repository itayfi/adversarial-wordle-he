import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { HelpCircle } from "lucide-react";
import { DialogDescription } from "@radix-ui/react-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip.tsx";

export const HelpDialog = () => {
  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <HelpCircle />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>הסברים</TooltipContent>
      </Tooltip>
      <DialogContent aria-description="הגדרות">
        <DialogHeader>
          <DialogTitle className="sr-only">הסברים</DialogTitle>
          <DialogDescription className="font-medium">
            כמו וורדל, אבל מניאק.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            איך משחקים?
          </h4>
          <p>כל ניחוש הוא מילה בת חמש אותיות בדיוק (בכתיב מלא).</p>
          <p>
            אחרי כל ניחוש, האותיות ייצבעו בצבעים שמשקפים עד כמה הניחוש קרוב:
          </p>
          <ul className="my-6 ms-6 list-disc [&>li]:mt-2">
            <li>
              <span className="text-white bg-emerald-700 w-16 text-center py-1 inline-block rounded-sm">
                ירוק
              </span>{" "}
              האות קיימת במילה, בדיוק במקום שנבחר.
            </li>
            <li>
              <span className="text-neutral-600 bg-yellow-400 w-16 text-center py-1 inline-block rounded-sm">
                צהוב
              </span>{" "}
              האות קיימת במילה אבל לא במיקום הזה. אותיות יכולות להופיע יותר מפעם
              אחת.
            </li>
            <li>
              <span className="text-white bg-neutral-500 w-16 text-center py-1 inline-block rounded-sm">
                אפור
              </span>{" "}
              האות לא קיימת במילה.
            </li>
          </ul>
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight pt-2">
            למה הוא מניאק?
          </h4>
          <p>כי זה יותר כיף ככה!</p>
          <p>
            המשחק מנסה כמה שיותר להימנע מלתת את התשובה. עם כל ניחוש, המשחק חושף
            כמה שפחות מידע, ומשנה את המילה הסודית אם צריך.
          </p>
          <p>
            מבוסס על{" "}
            <Button variant="link" className="p-0 inline" asChild>
              <a
                href="https://qntm.org/absurdle"
                target="_blank"
                rel="noreferrer"
              >
                Absurdle
              </a>
            </Button>
            .
          </p>
        </div>
        <DialogFooter className="sm:justify-center">
          <DialogClose asChild>
            <Button variant="outline">יאללה לשחק</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
