"use client";

import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { apiHelperService } from "@/services/verification";
import { Messages } from "@/utils/common/enum";
import Verification from "@/components/verification/verificationTable";
import { useSelector } from "react-redux";
import AdminDashboardLayout from "@/components/layouts/AdminDashboardLayout";

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

const BusinessTabs = () => {
  const [adminVerifications, setAdminVerifications] = useState<
    Verificationinfo[] | null
  >(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const user = useSelector((state: any) => state.user);
  const userId = user.uid;

  const fetchAdminVerifications = useCallback(async () => {
    try {
      if (!userId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const response = await apiHelperService.getAllVerificationsById(userId);
      const data = response?.data?.data;

      if (data) {
        setAdminVerifications(data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: Messages.FETCH_ERROR("verification"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [userId, toast]);

  useEffect(() => {
    fetchAdminVerifications();
  }, [fetchAdminVerifications]);


  return (
    <AdminDashboardLayout
      active="Admin Verification"
      breadcrumbItems={[
        { label: "Dashboard", link: "/dashboard" },
        { label: "Admin Oracle Verification", link: "/adminVerification" },
      ]}
    >
      <div className="mt-5">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Admin Oracle Verification</h1>
        </div>
        {loading ? (
          <div className="py-10 text-center text-muted-foreground">
            Loading verifications...
          </div>
        ) : (
          <Verification
            Data={adminVerifications}
            onRefetch={fetchAdminVerifications}
          />
        )}
      </div>
    </AdminDashboardLayout>
  );
};

export default BusinessTabs;
