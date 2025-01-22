import { ButtonIcon } from "./ui/arrowButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

type Params = {
  title: string | React.JSX.Element;
  description: string | React.JSX.Element;
  content: string | React.JSX.Element
}

export function CustomDialog({ title, description, content }: Params) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <ButtonIcon />
      </DialogTrigger>
      <DialogContent className="p-4 max-h-[80%] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}
