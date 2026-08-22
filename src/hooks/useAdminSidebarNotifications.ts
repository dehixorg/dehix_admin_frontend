import { useEffect, useState } from "react";

import { apiService } from "@/services/apiService";
import { Api_Methods } from "@/utils/common/enum";

let hasFetchedNotifications = false;
let isRefreshingNotifications = false;
let globalNotificationCounts: AdminSidebarNotifications = {
  connects: 0,
  skill: 0,
  domain: 0,
  projectDomain: 0,
  oracle: 0,
  kyc: 0,
};
const notificationSubscribers = new Set<(
  counts: AdminSidebarNotifications,
) => void>();
let notificationFetchPromise: Promise<boolean> | null = null;

export interface AdminSidebarNotifications {
  connects?: number;
  skill?: number;
  domain?: number;
  projectDomain?: number;
  oracle?: number;
  kyc?: number;
}

export function useAdminSidebarNotifications(): AdminSidebarNotifications & {
  refreshNotifications: () => Promise<boolean>;
} {
  // Load persisted counts from localStorage or use global variable
  const getInitialCounts = (): AdminSidebarNotifications => {
    try {
      const stored = localStorage.getItem("adminNotificationCounts");
      if (stored) {
        globalNotificationCounts = {
          ...globalNotificationCounts,
          ...JSON.parse(stored),
        };
        return { ...globalNotificationCounts };
      }
    } catch {
      // Ignore localStorage errors
    }
    return { ...globalNotificationCounts };
  };

  const [counts, setCounts] =
    useState<AdminSidebarNotifications>(getInitialCounts);

  const publishCounts = (newCounts: AdminSidebarNotifications) => {
    notificationSubscribers.forEach((subscriber) => subscriber(newCounts));
  };

  const storeCounts = (newCounts: AdminSidebarNotifications) => {
    globalNotificationCounts = { ...newCounts };

    try {
      localStorage.setItem(
        "adminNotificationCounts",
        JSON.stringify(newCounts),
      );
    } catch {
      // Ignore localStorage errors
    }

    publishCounts(newCounts);
  };

  const fetchAllCounts = async (): Promise<boolean> => {
    if (notificationFetchPromise) {
      return notificationFetchPromise;
    }

    notificationFetchPromise = (async () => {
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

          storeCounts(newCounts);
          hasFetchedNotifications = true;
          return true;
        }

        console.error("Failed to fetch notification counts: Invalid response");
        return false;
      } catch (error) {
        console.error("Error fetching notification counts:", error);
        return false;
      } finally {
        notificationFetchPromise = null;
      }
    })();

    return notificationFetchPromise;
  };

  useEffect(() => {
    const handleStoreUpdate = (newCounts: AdminSidebarNotifications) => {
      setCounts({ ...newCounts });
    };

    notificationSubscribers.add(handleStoreUpdate);
    handleStoreUpdate(globalNotificationCounts);

    if (!hasFetchedNotifications) {
      void fetchAllCounts();
    }

    // Listen for manual refresh events
    const handleRefreshEvent = () => {
      if (!isRefreshingNotifications) {
        isRefreshingNotifications = true;
        void fetchAllCounts().finally(() => {
          isRefreshingNotifications = false;
        });
      }
    };

    window.addEventListener("refreshNotifications", handleRefreshEvent);

    return () => {
      notificationSubscribers.delete(handleStoreUpdate);
      window.removeEventListener("refreshNotifications", handleRefreshEvent);
    };
  }, []);

  // Manual refresh function for immediate updates after actions
  const refreshNotifications = async (): Promise<boolean> => {
    try {
      const success = await fetchAllCounts();
      return success;
    } catch (error) {
      console.error("Error in refreshNotifications:", error);
      return false;
    }
  };

  return { ...counts, refreshNotifications };
}

// Export a reset function for logout scenarios
export const resetAdminSidebarNotifications = () => {
  hasFetchedNotifications = false;
  isRefreshingNotifications = false;
  globalNotificationCounts = {
    connects: 0,
    skill: 0,
    domain: 0,
    projectDomain: 0,
    oracle: 0,
    kyc: 0,
  };
  notificationFetchPromise = null;
  notificationSubscribers.forEach((subscriber) =>
    subscriber(globalNotificationCounts),
  );
  try {
    localStorage.removeItem("adminNotificationCounts");
  } catch {
    // Ignore localStorage errors
  }
};
