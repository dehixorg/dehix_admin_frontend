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
import { CustomComponentProps, FieldType } from "@/components/custom-table/FieldTypes";
import { CustomDialog } from "@/components/CustomDialog";
import Image from "next/image";
import AddNotify from "@/components/Notification/addNotify";

export default function Talent() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <SidebarMenu
        menuItemsTop={menuItemsTop}
        menuItemsBottom={menuItemsBottom}
        active="Notification"
      />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <CollapsibleSidebarMenu
            menuItemsTop={menuItemsTop}
            menuItemsBottom={menuItemsBottom}
            active="Notification"
          />
          <Breadcrumb
            items={[
              { label: "Dashboard", link: "/dashboard/Faq" },
              { label: "Notifications", link: "#" },
            ]}
          />
          <div className="relative ml-auto flex-1 md:grow-0">
            <DropdownProfile />
          </div>
        </header>
        <main className="ml-5">
          {/* <NotifyTable /> */}
          <CustomTable
            api="/ads"
            uniqueId="_id"
            fields={[
              {
                textValue: "Type",
                type: FieldType.STATUS,
                fieldName: "type",
                statusFormats: [
                  {
                    value: "FREELANCER",
                    bgColor: "#7c82f2",
                    textColor: "#03085e",
                    textValue: "Freelancer",
                  },
                  {
                    value: "BUSINESS",
                    bgColor: "yellow",
                    textColor: "#525002",
                    textValue: "Business",
                  },
                  {
                    value: "BOTH",
                    bgColor: "#57fa70",
                    textColor: "#024d0d",
                    textValue: "Both",
                  },
                ],
              },
              {
                fieldName: "heading",
                textValue: "Heading",
                type: FieldType.TEXT,
              },
              {
                fieldName: "description",
                textValue: "Description",
                type: FieldType.LONGTEXT,
                width: 500,
                wordsCnt: 50,
              },
              {
                textValue: "Status",
                type: FieldType.STATUS,
                fieldName: "status",
                statusFormats: [
                  {
                    value: "INACTIVE",
                    bgColor: "yellow",
                    textColor: "#525002",
                    textValue: "Inactive",
                  },
                  {
                    value: "ACTIVE",
                    bgColor: "#57fa70",
                    textColor: "#024d0d",
                    textValue: "Active",
                  },
                ],
              },
              {
                textValue: "",
                type: FieldType.CUSTOM,
                CustomComponent: ({ id, data }: CustomComponentProps) => {
                  return (
                    data && (
                      <CustomDialog
                        title={"Notification Details"}
                        description={
                          "Detailed information about the Notification."
                        }
                        content={
                          <>
                            <div className="flex flex-col items-start justify-start gap-0">
                              <h1 className="text-3xl w-full text-center font-medium text-neutral-900">
                                {data.heading}
                              </h1>
                              <p className="text-sm text-gray-500 mb-2">
                                {data.type}
                              </p>
                              <p className=" mb-2">{data.description}</p>
                              {data.background_img !== "" && (
                                <Image
                                  src={data.background_img}
                                  alt="notification"
                                  width={2000}
                                  height={2000}
                                  className="w-full h-fit"
                                />
                              )}
                              <p>
                                <strong>URL Count:</strong>
                                {data.importantUrl.length}
                              </p>
                              <ul className="list-inside">
                                {data.importantUrl.length > 0 ? (
                                  data.importantUrl.map(
                                    (url: any, urlIndex: number) => (
                                      <li key={urlIndex}>
                                        <p>
                                          <strong>URL Name:</strong>{" "}
                                          {url.urlName}
                                        </p>
                                        <p>
                                          <strong>URL:</strong>
                                          <a
                                            href={url.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 underline"
                                          >
                                            {url.url}
                                          </a>
                                        </p>
                                      </li>
                                    )
                                  )
                                ) : (
                                  <li className="text-gray-500">
                                    No URLs available
                                  </li>
                                )}
                              </ul>
                            </div>
                          </>
                        }
                      />
                    )
                  );
                },
              },
            ]}
            isDownload={true}
            title="Notifications"
            tableHeaderActions={[
              AddNotify
            ]}
          />
        </main>
      </div>
    </div>
  );
}
