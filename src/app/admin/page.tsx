"use client";

import SidebarMenu from "@/components/menu/sidebarMenu";
import CollapsibleSidebarMenu from "@/components/menu/collapsibleSidebarMenu";
import {
  menuItemsBottom,
  menuItemsTop,
} from "@/config/menuItems/admin/dashboardMenuItems";
import Breadcrumb from "@/components/shared/breadcrumbList";
import DropdownProfile from "@/components/shared/DropdownProfile";
import { CustomTable } from "@/components/custom-table/CustomTable";
import {
  CustomComponentProps,
  FieldType,
  FilterDataType,
} from "@/components/custom-table/FieldTypes";
import AddAdmin from "@/components/Admin/addAdmin";
import { CustomDialog } from "@/components/CustomDialog";

export default function Talent() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <SidebarMenu
        menuItemsTop={menuItemsTop}
        menuItemsBottom={menuItemsBottom}
        active="Admin"
      />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <CollapsibleSidebarMenu
            menuItemsTop={menuItemsTop}
            menuItemsBottom={menuItemsBottom}
            active="Admin"
          />
          <Breadcrumb
            items={[
              { label: "Dashboard", link: "/dashboard/admin" },
              { label: "Admin", link: "#" },
            ]}
          />
          <div className="relative ml-auto flex-1 md:grow-0">
            <DropdownProfile />
          </div>
        </header>
        <main className="ml-5 mr-3">
          <CustomTable
            api="/admin"
            uniqueId="_id"
            fields={[
              {
                textValue: "Type",
                fieldName: "type",
                type: FieldType.STATUS,
                statusFormats: [
                  {
                    textValue: "Admin",
                    value: "ADMIN",
                    bgColor: "#5bbcfc",
                    textColor: "#031f5c",
                  },
                  {
                    textValue: "Super Admin",
                    value: "SUPER_ADMIN",
                    bgColor: "#fc88c0",
                    textColor: "#5c0328",
                  },
                ],
              },
              {
                textValue: "Name",
                type: FieldType.CUSTOM,
                CustomComponent: ({ data }: CustomComponentProps) => {
                  return (
                    <span>
                      {data.firstName} {data.lastName}
                    </span>
                  );
                },
              },
              {
                fieldName: "userName",
                textValue: "Username",
                type: FieldType.TEXT,
              },
              {
                fieldName: "email",
                textValue: "Email",
                type: FieldType.TEXT,
              },
              {
                fieldName: "phone",
                textValue: "Phone Number",
                type: FieldType.TEXT,
              },
              {
                textValue: "Status",
                fieldName: "status",
                type: FieldType.STATUS,
                statusFormats: [
                  {
                    textValue: "Accepted",
                    value: "ACCEPTED",
                    bgColor: "#2dfc2d",
                    textColor: "#014d01",
                  },
                  {
                    textValue: "Pending",
                    value: "PENDING",
                    bgColor: "#eaf04d",
                    textColor: "#717501",
                  },
                ],
              },
              {
                textValue: "",
                type: FieldType.CUSTOM,
                CustomComponent: ({ data }: CustomComponentProps) => {
                  return (
                    <CustomDialog
                      title={"Admin Details"}
                      description={"Detailed information about the Admin."}
                      content={
                        <>
                          <div>
                            <p>
                              <strong>First Name:</strong> {data.firstName}
                            </p>
                            <p>
                              <strong>Last Name:</strong> {data.lastName}
                            </p>
                            <p>
                              <strong>Username:</strong> {data.userName}
                            </p>
                            <p>
                              <strong>Email ID:</strong> {data.email}
                            </p>
                            <p>
                              <strong>Phone No.:</strong> {data.phone}
                            </p>
                            <p>
                              <strong>Type:</strong> {data.type}
                            </p>
                            <p>
                              <strong>Status:</strong> {data.status}
                            </p>
                          </div>
                        </>
                      }
                    />
                  );
                },
              },
            ]}
            tableHeaderActions={[AddAdmin]}
            isDownload={true}
            searchColumn={[
              "firstName",
              "lastName",
              "userName",
              "email",
              "phone",
            ]}
            title="Admins"
            filterData={[
              {
                name: "status",
                textValue: "Status",
                type: FilterDataType.SINGLE,
                options: [
                  { label: "Accepted", value: "ACCEPTED" },
                  { label: "Pending", value: "PENDING" },
                ],
              },
            ]}
          />
        </main>
      </div>
    </div>
  );
}
