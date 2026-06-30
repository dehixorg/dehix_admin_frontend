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
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  description?: string;
  confirmButtonName?:string;
  cancelButtonName?:string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmButtonName,
  cancelButtonName,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={ onCancel}>
      <DialogContent className="p-4">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button  className= {getStatusButton(confirmButtonName)} onClick={ onConfirm}>
            {confirmButtonName}
          </Button>
          <Button   className={getStatusButton(cancelButtonName)} onClick={ onCancel}>
            {cancelButtonName}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;
