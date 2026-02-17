"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [adminVerifications, setAdminVerifications] = useState<Verificationinfo[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const user = useSelector((state: any) => state.user);
  const userId = user.uid;

  useEffect(() => {
    const fetchAdminVerifications = async () => {
      try {
        if (!userId) {
          setLoading(false);
          return;
        }
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
    };
    
    fetchAdminVerifications();
    
  }, [userId, toast]); 

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AdminDashboardLayout
      active="Business"
      breadcrumbItems={[
        { label: "Dashboard", link: "" },
        { label: "Admin Oracle Verification", link: "/adminVerification" },
      ]}
    >
      <Tabs defaultValue="Admin Oracle Verification">
        <TabsList className="flex w-full justify-between gap-2">
          <TabsTrigger value="Admin Oracle Verification" className="flex-1 text-center">
            Admin Oracle Verification
          </TabsTrigger>
        </TabsList>
        <TabsContent value="Admin Oracle Verification">
          <Verification Data={adminVerifications}/>
        </TabsContent>
      </Tabs>
    </AdminDashboardLayout>
  );
};

export default BusinessTabs;