"use client";
import AdminDashboardLayout from "@/components/layouts/AdminDashboardLayout";
import InterviewTable from "@/components/interview/Interviewtable";

export default function Talent() {
  return (
    <AdminDashboardLayout
      active="Interview"
      breadcrumbItems={[
        { label: "Dashboard", link: "/dashboard/" },
        { label: "Interviews", link: "#" },
      ]}
      mainClassName="ml-5"
    >
      <InterviewTable />
    </AdminDashboardLayout>
  );
}
