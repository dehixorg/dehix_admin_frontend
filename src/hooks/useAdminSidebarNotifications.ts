import { useEffect, useState } from "react";

import { apiService } from "@/services/apiService";
import { Api_Methods } from "@/utils/common/enum";

// Global flag to ensure notifications are only fetched once
let hasFetchedNotifications = false;
// Global flag to prevent multiple refresh fetches
let isRefreshingNotifications = false;
// Global variable to store notification counts
let globalNotificationCounts: AdminSidebarNotifications = {
  connects: 0,
  skill: 0,
  domain: 0,
  projectDomain: 0,
  oracle: 0,
  kyc: 0,
};

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
  // Load persisted counts from localStorage or use global variable
  const getInitialCounts = (): AdminSidebarNotifications => {
    try {
      const stored = localStorage.getItem("adminNotificationCounts");
      if (stored) {
        return { ...globalNotificationCounts, ...JSON.parse(stored) };
      }
    } catch {
      // Ignore localStorage errors
    }
    return { ...globalNotificationCounts };
  };

  const [counts, setCounts] =
    useState<AdminSidebarNotifications>(getInitialCounts);

  const fetchAllCounts = async () => {
    try {
      const res = await apiService({
        method: Api_Methods.GET,
        endpoint: `/admin/notification-counts`,
      });

      if (res.success && res.data?.data) {
        const newCounts = {
          connects: res.data.data.connects ?? 0,
          skill: res.data.data.skill ?? 0,
          domain: res.data.data.domain ?? 0,
          projectDomain: res.data.data.projectDomain ?? 0,
          oracle: res.data.data.oracle ?? 0,
          kyc: res.data.data.kyc ?? 0,
        };

        // Update global variable
        globalNotificationCounts = { ...newCounts };

        // Persist to localStorage
        try {
          localStorage.setItem(
            "adminNotificationCounts",
            JSON.stringify(newCounts),
          );
        } catch {
          // Ignore localStorage errors
        }

        setCounts(newCounts);
      }
    } catch {
      // silently fail
    }
  };

  useEffect(() => {
    // Only fetch if not already fetched globally
    if (!hasFetchedNotifications) {
      hasFetchedNotifications = true;
      fetchAllCounts();
    }

    // Listen for manual refresh events
    const handleRefreshEvent = () => {
      if (!isRefreshingNotifications) {
        isRefreshingNotifications = true;
        fetchAllCounts().finally(() => {
          isRefreshingNotifications = false;
        });
      }
    };

    window.addEventListener("refreshNotifications", handleRefreshEvent);

    return () => {
      window.removeEventListener("refreshNotifications", handleRefreshEvent);
    };
  }, []);

  // Manual refresh function for immediate updates after actions
  const refreshNotifications = () => {
    window.dispatchEvent(new CustomEvent("refreshNotifications"));
  };

  return { ...counts, refreshNotifications };
}
