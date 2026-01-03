import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { axiosInstance } from "@/lib/axiosinstance";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Messages } from "@/utils/common/enum";
import { CustomTableChildComponentsProps } from "../custom-table/FieldTypes";

interface DeleteBadgeLevelProps extends CustomTableChildComponentsProps {
  data: any;
  onClose?: () => void;
}

const DeleteBadgeLevel: React.FC<DeleteBadgeLevelProps> = ({ data, refetch, onClose }) => {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!data?._id) {
      toast({
        title: "Error",
        description: "Invalid badge/level ID",
        variant: "destructive",
      });
      return;
    }

    setIsDeleting(true);
    try {
      const response = await axiosInstance.delete(`/admin/gamification/definition/${data._id}`);
      
      if (response.status === 200) {
        toast({
          title: "Success",
          description: Messages.DELETE_SUCCESS("badge/level"),
        });
        refetch?.();
        onClose?.();
        setOpen(false);
      } else {
        throw new Error('Failed to delete badge/level');
      }
    } catch (error: any) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || Messages.DELETE_ERROR("badge/level"),
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="destructive" 
          size="sm"
          className="ml-2"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Badge/Level</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;{data?.name || 'this badge/level'}&quot;? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-600">
            <strong>Type:</strong> {data?.type}<br />
            <strong>Name:</strong> {data?.name}<br />
            <strong>Description:</strong> {data?.description || 'No description'}
          </p>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteBadgeLevel;
