"use client";
import InterviewTable from "@/components/interview/Interviewtable";
import AdminDashboardLayout from "@/components/layouts/AdminDashboardLayout";

export default function Talent() {
  return (
    <AdminDashboardLayout
      active="Interview"
      breadcrumbItems={[
        { label: "Dashboard", link: "/dashboard/" },
        { label: "Interviews", link: "#" },
      ]}
      showSearch={false}
      mainClassName="mx-5"
    >
      <InterviewTable />
    </AdminDashboardLayout>
  );
}
