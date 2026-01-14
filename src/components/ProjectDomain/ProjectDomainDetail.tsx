import { useState } from "react";
import { CustomDialog } from "../CustomDialog";
import { CustomComponentProps } from "../custom-table/FieldTypes";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import {
  approveProjectDomain,
  denyProjectDomain,
} from "@/services/projectdomain";
import { useToast } from "@/hooks/use-toast";

export const ProjectDomainDetail = ({
  id,
  data,
  refetch,
}: CustomComponentProps) => {
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const isInactiveFreelancerProjectDomain =
    data.status === "INACTIVE" && data.createdBy === "FREELANCER";

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      await approveProjectDomain(id, comment);
      toast({
        title: "Success",
        description: "Project Domain approved successfully",
      });
      setOpen(false);
      refetch?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to approve project domain",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeny = async () => {
    setIsProcessing(true);
    try {
      await denyProjectDomain(id, comment);
      toast({
        title: "Success",
        description: "Project Domain denied and removed",
      });
      setOpen(false);
      refetch?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to deny project domain",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <CustomDialog
      title={"Project Domain Details"}
      triggerState={open}
      setTriggerState={setOpen}
      description={""}
      content={
        <>
          <div>
            <div className="space-y-4">
              <p>
                <strong>Label:</strong> {data.label}
              </p>
              <p>
                <strong>Description:</strong>
                {data.description
                  ? data.description
                  : "No description available"}
              </p>
              <p>
                <strong>Status:</strong> {data.status}
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

              {isInactiveFreelancerProjectDomain && (
                <>
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">Approval Required</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      This project domain was created by a freelancer and
                      requires admin approval
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
              )}
            </div>
          </div>
        </>
      }
    />
  );
};
