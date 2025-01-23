"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { RootState } from '@/lib/store';
import {useSelector } from 'react-redux';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import SidebarMenu from "@/components/menu/sidebarMenu";
import CollapsibleSidebarMenu from "@/components/menu/collapsibleSidebarMenu";
import { menuItemsBottom, menuItemsTop } from "@/config/menuItems/admin/dashboardMenuItems";
import Breadcrumb from "@/components/shared/breadcrumbList";
import DropdownProfile from "@/components/shared/DropdownProfile";
import { apiHelperService } from "@/services/admin";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { AdminAccountStatus, AdminType, AdminPasswordStatus, Messages } from "@/utils/common/enum";
import { Badge } from "@/components/ui/badge";
import { getStatusBadge } from "@/utils/common/utils";
import { Skeleton } from "@/components/ui/skeleton";
import CurrentUserDetails from "@/components/Admin/adminview";

const AdminTabs = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <SidebarMenu menuItemsTop={menuItemsTop} menuItemsBottom={menuItemsBottom} active="Admin" />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <CollapsibleSidebarMenu menuItemsTop={menuItemsTop} menuItemsBottom={menuItemsBottom} active="Admin" />
          <Breadcrumb
            items={[
              { label: "Dashboard", link: "" },
              { label: "Admin", link: "/admin" },
              { label: id, link: "#" },
            ]}
          />
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search..." className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]" />
          </div>
          <DropdownProfile />
        </header>

        <main className="ml-5 mr-5 mt-6">
            <CurrentUserDetails id={id}/>
          </main>
      </div>
    </div>
  );
};

export default AdminTabs;
