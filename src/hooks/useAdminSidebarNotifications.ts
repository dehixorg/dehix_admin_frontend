import { useEffect, useState } from "react";

import { apiService } from "@/services/apiService";
import { Api_Methods } from "@/utils/common/enum";

export interface AdminSidebarNotifications {
  connects?: number;
  skill?: number;
  domain?: number;
  projectDomain?: number;
  oracle?: number;
  kyc?: number;
}

export function useAdminSidebarNotifications(): AdminSidebarNotifications & {
  refreshNotifications: () => void;
} {
  const [counts, setCounts] = useState<AdminSidebarNotifications>({
    connects: 0,
    skill: 0,
    domain: 0,
    projectDomain: 0,
    oracle: 0,
    kyc: 0,
  });

  const fetchAllCounts = async () => {
    try {
      const res = await apiService({
        method: Api_Methods.GET,
        endpoint: `/admin/notification-counts`,
      });

      if (res.success && res.data?.data) {
        setCounts({
          connects: res.data.data.connects ?? 0,
          skill: res.data.data.skill ?? 0,
          domain: res.data.data.domain ?? 0,
          projectDomain: res.data.data.projectDomain ?? 0,
          oracle: res.data.data.oracle ?? 0,
          kyc: res.data.data.kyc ?? 0,
        });
      }
    } catch {
      // silently fail
    }
  };

  useEffect(() => {
    fetchAllCounts();

    // Refresh every 30 seconds
    const interval = setInterval(fetchAllCounts, 30000);

    // Listen for manual refresh events
    const handleRefreshEvent = () => {
      fetchAllCounts();
    };

    window.addEventListener("refreshNotifications", handleRefreshEvent);

    return () => {
      clearInterval(interval);
      window.removeEventListener("refreshNotifications", handleRefreshEvent);
    };
  }, []);

  // Manual refresh function for immediate updates after actions
  const refreshNotifications = () => {
    window.dispatchEvent(new CustomEvent("refreshNotifications"));
  };

  return { ...counts, refreshNotifications };
}
