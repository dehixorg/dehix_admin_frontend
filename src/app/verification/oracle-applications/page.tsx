"use client";

import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { apiHelperService } from "@/services/verification";
import { Messages } from "@/utils/common/enum";

import OracleApplicationsTable from "@/components/verification/oracleApplicationsTable";
import AdminDashboardLayout from "@/components/layouts/AdminDashboardLayout";

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

const OracleApplicationsPage = () => {
  const [applications, setApplications] = useState<OracleApplication[] | null>(
    null,
  );
  const [_loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiHelperService.getOracleApplications();
      const data = response?.data?.data;

      if (data) {
        setApplications(data);
      } else {
        toast({
          title: "Error",
          description: Messages.FETCH_ERROR("oracle applications"),
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: Messages.FETCH_ERROR("oracle applications"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return (
    <AdminDashboardLayout
      active="Oracle Applications"
      breadcrumbItems={[
        { label: "Dashboard", link: "" },
        {
          label: "Oracle Applications",
          link: "/verification/oracle-applications",
        },
      ]}
    >
      <OracleApplicationsTable
        Data={applications}
        onRefetch={fetchApplications}
      />
    </AdminDashboardLayout>
  );
};

export default OracleApplicationsPage;
