import { useState } from "react";
import { CustomDialog } from "../CustomDialog";
import { CustomComponentProps } from "../custom-table/FieldTypes";
import EditDomainDescription from "./editDomaindesc";
import ChangeDomainStatus from "./ChangeDomainStatus";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { approveDomain, denyDomain } from "@/services/domain";
import { useToast } from "@/hooks/use-toast";

export const DomainDetail = ({ id, data, refetch }: CustomComponentProps) => {
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const isInactiveFreelancerDomain =
    data.status?.toLowerCase() === "inactive" &&
    data.createdBy === "FREELANCER";

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      await approveDomain(id, comment);
      toast({
        title: "Success",
        description: "Domain approved successfully",
      });
      setOpen(false);
      refetch?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to approve domain",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeny = async () => {
    setIsProcessing(true);
    try {
      await denyDomain(id, comment);
      toast({
        title: "Success",
        description: "Domain denied and removed",
      });
      setOpen(false);
      refetch?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to deny domain",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <CustomDialog
      title={"Domain Details"}
      triggerState={open}
      setTriggerState={setOpen}
      description={""}
      content={
        <>
          <div>
            <div className="space-y-4">
              <p>
                <strong>Name:</strong> {data.label}
              </p>
              <p>
                <strong>Description:</strong>
                {data.description
                  ? data.description
                  : "No description available"}
              </p>
              {data.createdBy && (
                <p>
                  <strong>Created By:</strong> {data.createdBy}
                </p>
              )}
              {data.createdById && (
                <p>
                  <strong>Created By ID:</strong> {data.createdById}
                </p>
              )}

              {isInactiveFreelancerDomain ? (
                <>
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">Approval Required</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      This domain was created by a freelancer and requires admin
                      approval
                    </p>
                    <Textarea
                      placeholder="Add a comment (optional for approval, recommended for denial)"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="mb-4"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={handleApprove}
                        disabled={isProcessing}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {isProcessing ? "Processing..." : "Approve"}
                      </Button>
                      <Button
                        onClick={handleDeny}
                        disabled={isProcessing}
                        variant="destructive"
                      >
                        {isProcessing ? "Processing..." : "Deny"}
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <ChangeDomainStatus
                    domainId={id}
                    currentStatus={data.status || "active"}
                    onUpdateSuccess={() => {
                      refetch?.();
                    }}
                  />
                  <EditDomainDescription
                    isDialogOpen={false}
                    setIsDialogOpen={() => {}}
                    domainId={id}
                    currentDescription={data.description || ""}
                    onUpdateSuccess={() => refetch?.()}
                  />
                </>
              )}
            </div>
          </div>
        </>
      }
    />
  );
};
