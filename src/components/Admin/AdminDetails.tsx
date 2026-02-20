import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { apiHelperService } from "@/services/admin";
import { Messages } from "@/utils/common/enum";

export const AdminDetails = ({ data, refetch }: { data: Record<string, any>; refetch?: () => void }) => {
  const { toast } = useToast();
  const [status, setStatus] = useState<string>(data.status);
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (newStatus: "ACCEPTED" | "REJECTED") => {
    if (status !== "PENDING" || loading) return;
    setLoading(true);
    try {
      const response = await apiHelperService.updateAdminStatus(data._id, newStatus);
      if (response.success) {
        setStatus(newStatus);
        toast({ title: "Success", description: `Admin ${newStatus.toLowerCase()} successfully.` });
        refetch?.();
      } else {
        toast({ title: "Error", description: Messages.UPDATE_ERROR("admin"), variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: Messages.UPDATE_ERROR("admin"), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <p>
          <strong>First Name:</strong> {data.firstName}
        </p>
        <p>
          <strong>Last Name:</strong> {data.lastName}
        </p>
        <p>
          <strong>Username:</strong> {data.userName}
        </p>
        <p>
          <strong>Email ID:</strong> {data.email}
        </p>
        <p>
          <strong>Phone No.:</strong> {data.phone}
        </p>
        <p>
          <strong>Type:</strong> {data.type}
        </p>
        <p>
          <strong>Status:</strong> {status}
        </p>
      </div>
      {status === "PENDING" && (
        <div className="flex gap-2 mt-4">
          <Button
            onClick={() => handleStatusChange("ACCEPTED")}
            className="bg-green-600 hover:bg-green-700 text-white"
            disabled={loading}
          >
            {loading ? "Updating..." : "Approve"}
          </Button>
          <Button
            onClick={() => handleStatusChange("REJECTED")}
            variant="destructive"
            disabled={loading}
          >
            {loading ? "Updating..." : "Reject"}
          </Button>
        </div>
      )}
    </>
  );
};
