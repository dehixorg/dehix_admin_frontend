"use client";

import { useSearchParams } from "next/navigation";
// import { ReportForm } from "@/components/form/ReportForm";
import AdminDashboardLayout from "@/components/layouts/AdminDashboardLayout";

export default function ReportPage() {
  const searchParams = useSearchParams();
  const reportedId = searchParams.get("id") || "";
  const reportType = searchParams.get("role") || "user";

  const reportData = {
    subject: "", // will be filled in the form
    description: "", // will be filled in the form
    report_type: reportType,
    status: "OPEN", // fixed default
    reportedById: "", // to be handled inside ReportForm (e.g., via session)
    reportedId: reportedId, // you can optionally pass this to the form if needed
  };

  return (
    <AdminDashboardLayout
      active="Report"
      breadcrumbItems={[
        
        { label: "Report", link: "#" },
      ]}
      showSearch={false}
      mainClassName="px-4 sm:px-6"
    >
      <h1 className="text-2xl font-semibold mb-6">Report an Issue</h1>
      {/* TO BE IMPLEMENTED */}
      {/* <ReportForm initialData={reportData} /> */}
    </AdminDashboardLayout>
  );
}
