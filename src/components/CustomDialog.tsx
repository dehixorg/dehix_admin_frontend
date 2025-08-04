'use client';

import { Dispatch, SetStateAction } from "react";
import { ButtonIcon } from "./ui/arrowButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

type Params = {
  title: string | React.JSX.Element;
  description: string | React.JSX.Element;
  content: string | React.JSX.Element;
  footer?: string | React.JSX.Element;
  triggerContent?: string | React.JSX.Element;
  triggerState?: boolean;
  setTriggerState?: Dispatch<SetStateAction<boolean>>;
};

export function CustomDialog({
  title,
  description,
  content,
  footer,
  triggerState,
  setTriggerState,
  triggerContent,
}: Params) {
  return (
    <Dialog open={triggerState} onOpenChange={setTriggerState}>
      {<DialogTrigger asChild>{triggerContent || <ButtonIcon />}</DialogTrigger>}
      <DialogContent 
        className="
          bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 
          rounded-xl shadow-lg p-6 max-h-[90vh] overflow-y-auto
        "
      >
        <DialogHeader 
          className="
            pb-4 mb-4 border-b border-gray-200 dark:border-gray-800 
            text-left flex flex-col gap-1
          "
        >
          <DialogTitle 
            className="
              text-xl font-semibold text-gray-900 dark:text-gray-50
            "
          >
            {title}
          </DialogTitle>
          <DialogDescription 
            className="
              text-sm text-gray-400 dark:text-gray-400  dark:text-white
            "
          >
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="py-2">
          {content}
        </div>
        <DialogFooter 
          className="
            pt-4 mt-4 border-t border-gray-200 dark:border-gray-800 
            flex justify-end gap-2 
          "
        >
          {footer}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}