// components/ui/ConfirmationDialog.tsx
import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getStatusButton } from "@/utils/common/utils";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onFirstButton: () => void;
  onSecondButton: () => void;
  title?: string;
  description?: string;
  firstButtonStatus?:string;
  secondButtonStatus?:string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onFirstButton,
  onSecondButton,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  firstButtonStatus,
  secondButtonStatus,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onSecondButton}>
      <DialogContent className="p-4">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button  className= {getStatusButton(firstButtonStatus)} onClick={onFirstButton}>
            {firstButtonStatus}
          </Button>
          <Button   className={getStatusButton(secondButtonStatus)} onClick={onSecondButton}>
            {secondButtonStatus}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;
