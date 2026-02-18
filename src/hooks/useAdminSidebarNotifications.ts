import { useEffect, useState } from "react";

import { apiService } from "@/services/apiService";
import { Api_Methods } from "@/utils/common/enum";

export interface AdminSidebarNotifications {
  connects?: number;
  skill?: number;
  domain?: number;
  projectDomain?: number;
  oracle?: number;
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
  });

  const fetchAllCounts = async () => {
    try {
      // Check if we have authentication token
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      if (!token) {
        // Set mock counts for development
        setCounts({
          connects: 4,
          skill: 2,
          domain: 3,
          projectDomain: 1,
          oracle: 5,
        });
        return;
      }

      const [connectsRes, skillRes, domainRes, projectDomainRes, oracleRes] =
        await Promise.all([
          // Connects
          apiService({
            method: Api_Methods.GET,
            endpoint: `/token-request`,
            params: { page: 1, limit: 1000 },
          }),
          // Skills
          apiService({
            method: Api_Methods.GET,
            endpoint: `/skills/admin`,
            params: { page: 1, limit: 1000 },
          }),
          // Domains
          apiService({
            method: Api_Methods.GET,
            endpoint: `/domain/admin`,
            params: { page: 1, limit: 1000 },
          }),
          // Project Domains
          apiService({
            method: Api_Methods.GET,
            endpoint: `/projectdomain`,
            params: { page: 1, limit: 1000 },
          }),
          // Oracle Verification
          apiService({
            method: Api_Methods.GET,
            endpoint: `/verification/oracle`,
            params: { page: 1, limit: 1000 },
          }),
        ]);

      // Process Connects - Use exact count from API response
      let connectsCount = 0;
      if (connectsRes.success && connectsRes.data?.data) {
        // Count PENDING status items
        if (Array.isArray(connectsRes.data.data)) {
          const pendingItems = connectsRes.data.data.filter((item: any) => {
            return item.status === "PENDING";
          });
          connectsCount = pendingItems.length;
        }
      } else {
        // Error handling without console
      }

      // Process Skills - Use exact count from API response
      let skillCount = 0;
      if (skillRes.success && skillRes.data?.data) {
        // Count PENDING or INACTIVE status items
        if (Array.isArray(skillRes.data.data)) {
          const pendingItems = skillRes.data.data.filter((item: any) => {
            return item.status === "PENDING" || item.status === "INACTIVE";
          });
          skillCount = pendingItems.length;
        }
      } else {
        // Error handling without console
      }

      // Process Domains - Use exact count from API response
      let domainCount = 0;
      if (domainRes.success && domainRes.data?.data) {
        // Count PENDING or INACTIVE status items
        if (Array.isArray(domainRes.data.data)) {
          const pendingItems = domainRes.data.data.filter((item: any) => {
            return item.status === "PENDING" || item.status === "INACTIVE";
          });
          domainCount = pendingItems.length;
        }
      } else {
        // Error handling without console
      }

      // Process Project Domains - Use exact count from API response
      let projectDomainCount = 0;
      if (projectDomainRes.success && projectDomainRes.data?.data) {
        // Count PENDING or INACTIVE status items
        if (Array.isArray(projectDomainRes.data.data)) {
          const pendingItems = projectDomainRes.data.data.filter(
            (item: any) => {
              return item.status === "PENDING" || item.status === "INACTIVE";
            },
          );
          projectDomainCount = pendingItems.length;
        }
      } else {
        // Error handling without console
      }

      // Process Oracle Verification - Use exact count from API response
      let oracleCount = 0;
      if (oracleRes.success && oracleRes.data?.data) {
        // For Oracle, check verification_status field
        if (Array.isArray(oracleRes.data.data)) {
          const pendingItems = oracleRes.data.data.filter((item: any) => {
            return item.verification_status === "PENDING";
          });
          oracleCount = pendingItems.length;
        }
      } else {
        // Error handling without console
      }

      const finalCounts = {
        connects: connectsCount,
        skill: skillCount,
        domain: domainCount,
        projectDomain: projectDomainCount,
        oracle: oracleCount,
      };

      setCounts(finalCounts);
    } catch (error) {
      // Error handling without console
    }
  };

  useEffect(() => {
    fetchAllCounts();

    // Refresh every 10 seconds instead of 30 for faster updates
    const interval = setInterval(fetchAllCounts, 10000);

    // Listen for manual refresh events
    const handleRefreshEvent = () => {
      console.log("🔄 Received refresh event, triggering fetchAllCounts");
      fetchAllCounts();
    };

    window.addEventListener("refreshNotifications", handleRefreshEvent);

    return () => {
      clearInterval(interval);
      window.removeEventListener("refreshNotifications", handleRefreshEvent);
    };
  }, []);

  // Manual refresh function for immediate updates after actions
  const refreshNotifications = async () => {
    // Dispatch a global event that all hook instances will listen to
    window.dispatchEvent(new CustomEvent("refreshNotifications"));
  };

  return { ...counts, refreshNotifications };
}
