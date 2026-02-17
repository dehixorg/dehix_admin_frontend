"use client";

import { useSearchParams } from "next/navigation";
import AdminDashboardLayout from "@/components/layouts/AdminDashboardLayout";

import CurrentUserDetails from "@/components/Admin/adminview";

const AdminTabs = () => {
  const searchParams = useSearchParams();
  const user_id = searchParams.get("id") || "";
  return (
    <AdminDashboardLayout
      active="Admin"
      breadcrumbItems={[
        { label: "Dashboard", link: "" },
        { label: "Admin", link: "/admin" },
        { label: user_id, link: "#" },
      ]}
      mainClassName="ml-5 mr-5 mt-6"
    >
      <CurrentUserDetails id={user_id}/>
    </AdminDashboardLayout>
  );
};

export default AdminTabs;
