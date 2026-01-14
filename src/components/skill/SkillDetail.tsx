import { useState } from "react";
import { CustomDialog } from "../CustomDialog";
import { CustomComponentProps } from "../custom-table/FieldTypes";
import EditSkillDescription from "./editSkilldesc";
import ChangeSkillStatus from "./ChangeSkillStatus";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { approveSkill, denySkill } from "@/services/skill";
import { useToast } from "@/hooks/use-toast";

export const SkillDetails = ({ id, data, refetch }: CustomComponentProps) => {
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const isInactiveFreelancerSkill =
    data.status?.toLowerCase() === "inactive" &&
    data.createdBy === "FREELANCER";

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      await approveSkill(id, comment);
      toast({
        title: "Success",
        description: "Skill approved successfully",
      });
      setOpen(false);
      refetch?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to approve skill",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeny = async () => {
    setIsProcessing(true);
    try {
      await denySkill(id, comment);
      toast({
        title: "Success",
        description: "Skill denied and removed",
      });
      setOpen(false);
      refetch?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to deny skill",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <CustomDialog
      title={"Skill Details"}
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

              {isInactiveFreelancerSkill ? (
                <>
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">Approval Required</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      This skill was created by a freelancer and requires admin
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
                  <ChangeSkillStatus
                    skillId={id}
                    currentStatus={data.status || "active"}
                    onUpdateSuccess={() => {
                      refetch?.();
                    }}
                  />
                  <EditSkillDescription
                    skillId={id}
                    currentDescription={data.description || ""}
                    onUpdateSuccess={() => {
                      setOpen(false);
                      refetch?.();
                    }}
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
