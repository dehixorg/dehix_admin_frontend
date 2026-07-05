"use client";
import * as React from "react";
import { PackageOpen, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { ButtonIcon } from "@/components/ui/arrowButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useToast } from "@/components/ui/use-toast";
import { apiHelperService } from "@/services/verification";
import { getStatusBadge } from "@/utils/common/utils";

interface OracleApplication {
  _id: string;
  firstName?: string;
  lastName?: string;
  userName?: string;
  email?: string;
  oracleStatus: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Props {
  title?: string;
  Data: OracleApplication[] | null;
  onRefetch?: () => void;
}

const OracleApplicationsTable: React.FC<Props> = ({ Data, onRefetch }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedApplication, setSelectedApplication] =
    React.useState<OracleApplication | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleOpenDetail = (application: OracleApplication) => {
    setSelectedApplication(application);
    setDetailDialogOpen(true);
  };

  const handleSubmitAction = async (action: "APPROVED" | "FAILED") => {
    if (!selectedApplication?._id) return;

    setIsProcessing(true);
    try {
      const response = await apiHelperService.updateOracleApplication(
        selectedApplication._id,
        { oracleStatus: action },
      );

      if (response?.success) {
        toast({
          title: "Success",
          description: `Oracle application ${action === "APPROVED" ? "approved" : "rejected"} successfully.`,
        });
        setDetailDialogOpen(false);
        onRefetch?.();
      } else {
        toast({
          title: "Error",
          description:
            response?.data?.message ||
            `Failed to ${action === "APPROVED" ? "approve" : "reject"} oracle application.`,
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
      <div className="text-center py-10">
        <PackageOpen className="mx-auto text-gray-500" size={100} />
        <p className="text-gray-500">No Oracle Applications Found.</p>
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
                  <TableHead className="text-[13px] font-semibold text-foreground py-4">Name</TableHead>
                  <TableHead className="text-[13px] font-semibold text-foreground py-4">Username</TableHead>
                  <TableHead className="text-[13px] font-semibold text-foreground py-4">Email</TableHead>
                  <TableHead className="text-[13px] font-semibold text-foreground py-4">Freelancer ID</TableHead>
                  <TableHead className="text-[13px] font-semibold text-foreground py-4">Status</TableHead>
                  <TableHead className="text-[13px] font-semibold text-foreground py-4 text-right">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Data.length > 0 ? (
                  Data.map((application) => (
                    <TableRow key={application._id} className="hover:bg-accent/5">
                      <TableCell className="text-[13px] py-4">
                        <span className="font-medium text-foreground">
                          {application.firstName || application.lastName
                            ? `${application.firstName ?? ""} ${application.lastName ?? ""}`.trim()
                            : "N/A"}
                        </span>
                      </TableCell>
                      <TableCell className="text-[13px] py-4">
                        <span className="text-foreground">
                          {application.userName ?? "N/A"}
                        </span>
                      </TableCell>
                      <TableCell className="text-[13px] py-4">
                        <span className="text-muted-foreground">
                          {application.email ?? "N/A"}
                        </span>
                      </TableCell>
                      <TableCell className="text-[13px] py-4">
                        {application._id ? (
                          <div className="flex items-center space-x-1">
                            <button
                              type="button"
                              onClick={() =>
                                router.push(
                                  `/freelancer/tabs?id=${application._id}`,
                                )
                              }
                              className="text-blue-500 hover:underline font-medium"
                            >
                              {formatID(application._id)}
                            </button>
                            <CopyButton id={application._id} />
                          </div>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell className="text-[13px] py-4">
                        <Badge
                          className={`rounded-full px-3 py-0.5 text-[11px] font-semibold ${getStatusBadge(application.oracleStatus)}`}
                        >
                          {application.oracleStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right py-4">
                        <ButtonIcon
                          onClick={() => handleOpenDetail(application)}
                          aria-label="View oracle application details"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      <div className="text-center py-10 w-full mt-10">
                        <PackageOpen
                          className="mx-auto text-gray-500"
                          size="100"
                        />
                        <p className="text-gray-500">
                          No oracle applications available.
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

      {/* Oracle Application Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Oracle Application Details</DialogTitle>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-medium text-muted-foreground">
                    Name
                  </span>
                  <p className="font-semibold">
                    {selectedApplication.firstName ||
                      selectedApplication.lastName
                      ? `${selectedApplication.firstName ?? ""} ${selectedApplication.lastName ?? ""}`.trim()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">
                    Username
                  </span>
                  <p className="font-semibold">
                    {selectedApplication.userName ?? "N/A"}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">
                    Email
                  </span>
                  <p className="font-semibold">
                    {selectedApplication.email ?? "N/A"}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">
                    Status
                  </span>
                  <p>
                    <Badge
                      className={getStatusBadge(
                        selectedApplication.oracleStatus,
                      )}
                    >
                      {selectedApplication.oracleStatus}
                    </Badge>
                  </p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">
                    Freelancer ID
                  </span>
                  <p className="font-semibold">
                    {selectedApplication._id
                      ? formatID(selectedApplication._id)
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4 space-y-3">
                <h4 className="text-sm font-semibold">Update Oracle Status</h4>
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
                    onClick={() => handleSubmitAction("FAILED")}
                  >
                    <X className="h-4 w-4 mr-1" />
                    {isProcessing ? "Processing..." : "Reject"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OracleApplicationsTable;
