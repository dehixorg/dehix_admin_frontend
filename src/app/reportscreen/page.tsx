"use client";

import { useSearchParams } from "next/navigation";
// import { ReportForm } from "@/components/form/ReportForm";
import SidebarMenu from "@/components/menu/sidebarMenu";
import CollapsibleSidebarMenu from "@/components/menu/collapsibleSidebarMenu";
import { menuItemsBottom, menuItemsTop } from "@/config/menuItems/admin/dashboardMenuItems";
import Breadcrumb from "@/components/shared/breadcrumbList";
import DropdownProfile from "@/components/shared/DropdownProfile";

export default function ReportPage() {
  const searchParams = useSearchParams();
  const reportedId = searchParams.get("id") || "";
  const reportType = searchParams.get("role") || "user";

  const reportData = {
    subject: "",             // will be filled in the form
    description: "",         // will be filled in the form
    report_type: reportType,
    status: "OPEN",       // fixed default
    reportedById: "",        // to be handled inside ReportForm (e.g., via session)
    reportedId: reportedId,  // you can optionally pass this to the form if needed
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <SidebarMenu menuItemsTop={menuItemsTop} menuItemsBottom={menuItemsBottom} active="Report" />

      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <CollapsibleSidebarMenu
            menuItemsTop={menuItemsTop}
            menuItemsBottom={menuItemsBottom}
            active="Report"
          />
          <Breadcrumb
            items={[
              { label: "Dashboard", link: "/dashboard" },
              { label: "Report", link: "#" },
            ]}
          />
          <div className="relative ml-auto flex-1 md:grow-0">
            <DropdownProfile />
          </div>
        </header>

        <div className="px-4 sm:px-6">
          <h1 className="text-2xl font-semibold mb-6">Report an Issue</h1>
          {/* <ReportForm initialData={reportData} /> */}
        </div>
      </div>
    </div>
  );
}
