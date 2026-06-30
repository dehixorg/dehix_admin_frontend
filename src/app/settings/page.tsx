"use client";
import AdminDashboardLayout from "@/components/layouts/AdminDashboardLayout";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { RootState } from '@/lib/store';
import {useSelector } from 'react-redux';
import {
  menuItemsBottom,
  menuItemsTop,
} from "@/config/menuItems/admin/dashboardMenuItems";
import CurrentUserDetails from "@/components/settings/settingpage"

export default function Settings() {
  const user = useSelector((state: RootState) => state.user);
  return (
    <AdminDashboardLayout
      active="Settings"
      breadcrumbItems={[
        { label: "Dashboard", link: "/admin" },
        { label: "Settings", link: "#" },
      ]}
      mainClassName="mx-5"
    >
      <CurrentUserDetails user_id={user.uid}/>
    </AdminDashboardLayout>
  );
}
