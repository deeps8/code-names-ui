import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";

export function PlayerList() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={"sm"} variant="secondary">
          Players
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Players List</DialogTitle>
        </DialogHeader>
        <div>
          <ul className="">
            <li>Player 1</li>
            <li>Player 1</li>
            <li>Player 1</li>
            <li>Player 1</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
