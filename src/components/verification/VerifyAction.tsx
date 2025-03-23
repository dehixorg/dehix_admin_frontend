"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { apiHelperService } from "@/services/verification";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Check, Eye, Mail, Phone, X } from "lucide-react";
import { CustomComponentProps } from "../custom-table/FieldTypes";
import { useToast } from "../ui/use-toast";
import { useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

export const VerifyAction = ({ id, data, refetch }: CustomComponentProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false)
  const requester = data["Requester"];
  const verifier = data["Verifier"];
  const handleUpdate = async (
    status: "PENDING" | "APPROVED" | "DENIED",
    comments: string = ""
  ) => {
    try {
      setIsSubmitting(true)
      await apiHelperService.updateVerification(
        {
          document_id: data["document_id"],
          doc_type: data["doc_type"],
          verification_id: data["_id"],
          verifier_id: data["verifier_id"],
        },
        {
          verification_status: status,
          comments,
        }
      );
      toast({ title: "Verification Data Updated Successfully!" });
      refetch?.();
    } catch (error) {
      console.log(error);
      toast({
        title: "Verification Data Failed To Update!",
        description: "Please try again later!",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false)
    }
  };

  return (
    <>
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent className="w-[30vw]">
          <DialogHeader>
            <DialogTitle>Update Verification</DialogTitle>
          </DialogHeader>
          <Label htmlFor="comment">Remarks</Label>
          <Textarea
            value={comment}
            id="comment"
            onChange={(e) => setComment(e.target.value)}
            placeholder="For Ex. All documents were fine!"
            className="resize-none"
          />
          <div className="w-full flex items-center justify-between">
            <Button
              disabled={isSubmitting}
              className="bg-red-200 disabled:bg-opacity-90 disabled:hover: w-[10vw] text-red-800 rounded hover:bg-red-300 transition-colors"
              onClick={() => handleUpdate("DENIED", comment)}
            >
              <X className="size-5 mr-1" />
              Deny
            </Button>
            <Button
              disabled={isSubmitting}
              className="bg-green-200 disabled:bg-opacity-90 disabled:hover: w-[10vw] text-green-800 rounded hover:bg-green-300 transition-colors"
              onClick={() => handleUpdate("APPROVED", comment)}
            >
              <Check className="size-5 mr-1" />
              Approve
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-fit">
          <DialogHeader>
            <DialogTitle>Verification Data</DialogTitle>
            <DialogDescription>{data["verification_status"]}</DialogDescription>
          </DialogHeader>
          <div className="p-3 w-full h-full flex items-center justify-between gap-2">
            <Image
              src={requester["profilePic"]}
              width={200}
              height={200}
              alt=""
              className="w-[50%] h-[40vh] object-contain"
            />
            <div className="p-4 min-w-[50%] flex flex-col items-start justify-start gap-0 h-full">
              <h3 className="text-2xl font-semibold">
                {requester.firstName} {requester.lastName}
              </h3>
              <p className="text-xs uppercase p-1 bg-green-300 text-green-950 rounded">
                {requester.role}
              </p>
              <p className="text-sm flex items-center justify-start gap-1 text-gray-700 mt-2">
                <Phone className="size-4" />
                {requester.phone}
              </p>
              <p className="text-sm flex items-center justify-start gap-1 text-gray-700">
                <Mail className="size-4" />
                {requester.email}
              </p>
              <p className="text-sm flex items-center justify-start gap-1 mb-2 text-gray-700">
                @{" "}{requester.userName}
              </p>

              <p className="text-gray-800 mb-2">
                Requested Verification For:{" "}
                <span className="uppercase bg-blue-300 text-blue-800 p-1 rounded">
                  {data["doc_type"]}
                </span>
              </p>
              <p className="text-gray-800">
                Assigned To:{" "}
                <span className="bg-gray-200 text-gray-800 p-1 rounded">
                  @{verifier.userName}
                </span>
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger className="text-sm dark:text-gray-300 text-gray-600 hover:dark:text-gray-800 hover:bg-gray-200 p-1 rounded transition duration-300">
          <DotsVerticalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-1 m-0">
          <DropdownMenuItem
            className="w-32 px-0 py-0 my-1"
            onClick={() => setOpen(true)}
          >
            <div
              className="bg-blue-200 text-blue-800 text-center hover:bg-blue-300
                  text-sm w-full py-2 px-6 flex items-center dark:text-gray-300 justify-start hover:cursor-pointer gap-2 font-medium"
            >
              <Eye className="size-4" />
              <span>View</span>
            </div>
          </DropdownMenuItem>
          {data["verification_status"] === "PENDING" && (
            <DropdownMenuItem
              className="w-32 px-0 py-0 my-1"
              onClick={() => setActionDialogOpen(true)}
            >
              <div
                className="bg-green-200 text-green-800 text-center hover:bg-green-300
                  text-sm w-full py-2 px-6 flex items-center dark:text-gray-300 justify-start hover:cursor-pointer gap-2 font-medium
                "
              >
                <Check className="size-4" />
                <span>Update</span>
              </div>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
