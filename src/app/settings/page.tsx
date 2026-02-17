"use client";
import { RootState } from '@/lib/store';
import {useSelector } from 'react-redux';
import CurrentUserDetails from "@/components/settings/settingpage"
import AdminDashboardLayout from "@/components/layouts/AdminDashboardLayout";

export default function Settings() {
  const user = useSelector((state: RootState) => state.user);
  return (
    <AdminDashboardLayout
      active="Settings"
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "Settings", link: "#" },
      ]}
      mainClassName="ml-5 mr-3"
    >
      <CurrentUserDetails user_id={user.uid}/>
    </AdminDashboardLayout>
  );
}
