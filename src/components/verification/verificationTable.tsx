"use client";
import * as React from "react";
import { PackageOpen, Check, X } from "lucide-react";
import { useRouter } from "next/navigation"; // For navigation
import { ButtonIcon } from "@/components/ui/arrowButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatTime } from "@/lib/utils";
import { formatID } from "@/utils/common/enum";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";


import CopyButton from "@/components/copybutton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { apiHelperService } from "@/services/verification";
import { getStatusBadge } from "@/utils/common/utils";

interface Verificationinfo {
  _id?: string;
  verifier_id: string;
  verifier_username: string;
  requester_id: string;
  requester_username?: string;
  document_id: string;
  verification_status: string;
  comment?: string;
  verified_at?: string;
  doc_type: string;
  Requester?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    role?: string;
    userName?: string;
    profilePic?: string;
  };
  result?: Record<string, unknown>;
}

interface Props {
  title?: string;
  Data: Verificationinfo[] | null;
  onRefetch?: () => void;
}

const Verification: React.FC<Props> = ({ Data, onRefetch }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedVerification, setSelectedVerification] =
    React.useState<Verificationinfo | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = React.useState(false);
  const [comment, setComment] = React.useState("");
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleOpenDetail = (verification: Verificationinfo) => {
    setSelectedVerification(verification);
    setComment("");
    setDetailDialogOpen(true);
  };

  const handleSubmitAction = async (action: "APPROVED" | "DENIED") => {
    if (!selectedVerification?._id) return;

    setIsProcessing(true);
    try {
      const payload: {
        verification_status: "APPROVED" | "DENIED";
        verifiedAt: string;
        comment?: string;
      } = {
        verification_status: action,
        verifiedAt: new Date().toISOString(),
      };
      if (comment) {
        payload.comment = comment;
      }
      const response = await apiHelperService.updateVerificationStatus(
        selectedVerification._id,
        payload,
      );

      if (response?.success) {
        toast({
          title: "Success",
          description: `Verification ${action === "APPROVED" ? "approved" : "denied"} successfully.`,
        });
        setDetailDialogOpen(false);
        onRefetch?.();
      } else {
        toast({
          title: "Error",
          description:
            response?.data?.message ||
            `Failed to ${action === "APPROVED" ? "approve" : "deny"} verification.`,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!Data) {
    return (
      <div className="">
        <div className="text-center py-10">
          <PackageOpen className="mx-auto text-gray-500" size={100} />
          <p className="text-gray-500">No Verification Found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="mb-8">
        <Card className="border-none shadow-none bg-transparent">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b">
                  <TableHead className="text-[13px] font-semibold text-foreground py-4">Type</TableHead>
                  <TableHead className="text-[13px] font-semibold text-foreground py-4">Requester</TableHead>
                  <TableHead className="text-[13px] font-semibold text-foreground py-4">Requester ID</TableHead>
                  <TableHead className="text-[13px] font-semibold text-foreground py-4">Verifier</TableHead>
                  <TableHead className="text-[13px] font-semibold text-foreground py-4">Document ID</TableHead>
                  <TableHead className="text-[13px] font-semibold text-foreground py-4">Verified At</TableHead>
                  <TableHead className="text-[13px] font-semibold text-foreground py-4">Status</TableHead>
                  <TableHead className="text-[13px] font-semibold text-foreground py-4 text-right">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Data.length > 0 ? (
                  Data.map((user) => (
                    <TableRow key={user._id ?? user.document_id} className="hover:bg-accent/5">
                      <TableCell className="text-[13px] py-4">
                        <span className="font-medium text-foreground">
                          {(user.doc_type || "N/A").toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell className="text-[13px] py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">
                            {user.Requester?.firstName ||
                              user.Requester?.lastName
                              ? `${user.Requester?.firstName ?? ""} ${user.Requester?.lastName ?? ""}`.trim()
                              : user.requester_username ?? "No Data Available"}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {user.Requester?.email ?? ""}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-[13px] py-4">
                        {user.requester_id ? (
                          <div className="flex items-center space-x-1">
                            <button
                              type="button"
                              onClick={() =>
                                router.push(
                                  `/freelancer/tabs?id=${user.requester_id}`,
                                )
                              }
                              className="text-blue-500 hover:underline font-medium"
                            >
                              {formatID(user.requester_id || "")}
                            </button>
                            <CopyButton id={user.requester_id} />
                          </div>
                        ) : (
                          <span className="text-muted-foreground">No Data Available</span>
                        )}
                      </TableCell>

                      <TableCell className="text-[13px] py-4">
                        <span className="text-foreground">
                          {user.verifier_username || "No Data Available"}
                        </span>
                      </TableCell>

                      <TableCell className="text-[13px] py-4">
                        {user.document_id ? (
                          <div className="flex items-center space-x-1">
                            <span className="text-foreground font-medium">{formatID(user.document_id || "")}</span>
                            <CopyButton id={user.document_id || ""} />
                          </div>
                        ) : (
                          <span className="text-muted-foreground">No Data Available</span>
                        )}
                      </TableCell>
                      <TableCell className="text-[13px] py-4 text-muted-foreground">
                        {formatTime(user.verified_at) || "No Data Available"}
                      </TableCell>
                      <TableCell className="text-[13px] py-4">
                        {user.verification_status ? (
                          <Badge
                            className={`rounded-full px-3 py-0.5 text-[11px] font-semibold ${getStatusBadge(user.verification_status)}`}
                          >
                            {user.verification_status}
                          </Badge>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                      <TableCell className="text-right py-4">
                        <ButtonIcon
                          onClick={() => handleOpenDetail(user)}
                          aria-label="View verification details"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center">
                      <div className="text-center py-10 w-full mt-10">
                        <PackageOpen
                          className="mx-auto text-gray-500"
                          size="100"
                        />
                        <p className="text-gray-500">
                          No data available. <br />
                          This feature will be available soon. <br />
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {/* Verification Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Verification Details</DialogTitle>
          </DialogHeader>
          {selectedVerification && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-medium text-muted-foreground">
                    Type
                  </span>
                  <p className="font-semibold">
                    {(selectedVerification.doc_type || "N/A").toUpperCase()}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">
                    Status
                  </span>
                  <p>
                    <Badge
                      className={getStatusBadge(
                        selectedVerification.verification_status,
                      )}
                    >
                      {selectedVerification.verification_status}
                    </Badge>
                  </p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">
                    Requester
                  </span>
                  <p className="font-semibold">
                    {selectedVerification.Requester?.firstName ||
                      selectedVerification.Requester?.lastName
                      ? `${selectedVerification.Requester?.firstName ?? ""} ${selectedVerification.Requester?.lastName ?? ""}`.trim()
                      : selectedVerification.requester_username ?? "N/A"}
                  </p>
                  {selectedVerification.Requester?.email && (
                    <p className="text-xs text-muted-foreground">
                      {selectedVerification.Requester.email}
                    </p>
                  )}
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">
                    Verifier
                  </span>
                  <p className="font-semibold">
                    {selectedVerification.verifier_username || "N/A"}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">
                    Document ID
                  </span>
                  <p className="font-semibold">
                    {selectedVerification.document_id
                      ? formatID(selectedVerification.document_id)
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">
                    Verified At
                  </span>
                  <p className="font-semibold">
                    {formatTime(selectedVerification.verified_at) || "Not yet"}
                  </p>
                </div>
              </div>

              <div>
                <span className="text-sm font-medium text-muted-foreground">
                  Comment
                </span>
                <p className="text-sm">
                  {selectedVerification.comment || "No Comments Available"}
                </p>
              </div>

              {selectedVerification.verification_status?.toUpperCase() ===
                "PENDING" && (
                  <div className="border-t pt-4 space-y-3">
                    <h4 className="text-sm font-semibold">Update Status</h4>
                    <Textarea
                      id="action-comment"
                      placeholder="Add a comment (optional)..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        disabled={isProcessing}
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleSubmitAction("APPROVED")}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        {isProcessing ? "Processing..." : "Approve"}
                      </Button>
                      <Button
                        size="sm"
                        disabled={isProcessing}
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => handleSubmitAction("DENIED")}
                      >
                        <X className="h-4 w-4 mr-1" />
                        {isProcessing ? "Processing..." : "Deny"}
                      </Button>
                    </div>
                  </div>
                )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Verification;
