// your-page-file.tsx (e.g., Talent.tsx or Bids.tsx)
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
import { FieldType, FilterDataType, Params as TableProps } from "@/components/custom-table/FieldTypes";
import { BidDetails } from "@/components/bids/BidDetails"; // <-- Import the new component
import AdminDashboardLayout from "@/components/layouts/AdminDashboardLayout";

const customTableProps: TableProps = {
  api: "bid",
  uniqueId: "_id",
  fields: [
    {
      textValue: "Project ID",
      fieldName: "project_id",
      type: FieldType.LONGTEXT,
      wordsCnt: 20,
    },
    {
      textValue: "Bidder ID",
      fieldName: "bidder_id",
      type: FieldType.LONGTEXT,
      wordsCnt: 10,
    },
    {
      textValue: "Current Price",
      fieldName: "current_price",
      type: FieldType.CURRENCY,
    },
    {
      textValue: "Description",
      fieldName: "description",
      type: FieldType.LONGTEXT,
      width: 500,
      wordsCnt: 50,
    },
    {
      textValue: "Status",
      fieldName: "bid_status",
      type: FieldType.STATUS,
      statusFormats: [
        {
          textValue: "Accepted",
          value: "ACCEPTED",
          bgColor: "#57fa70",
          textColor: "#024d0d",
        },
        {
          textValue: "Pending",
          value: "PENDING",
          bgColor: "yellow",
          textColor: "#525002",
        },
        {
          textValue: "Rejected",
          value: "REJECTED",
          bgColor: "red",
          textColor: "black",
        },
      ],
    },
    // The new custom column to open the dialog
    {
      textValue: "", // Leave the header text empty for a clean look
      type: FieldType.CUSTOM,
      CustomComponent: BidDetails,
    },
  ],
  isDownload: true,
  searchColumn: ["current_price", "description"],
  title: "Bids",
  filterData: [
    {
      name: "bid_status",
      textValue: "Status",
      type: FilterDataType.SINGLE,
      options: [
        { label: "Accepted", value: "ACCEPTED" },
        { label: "Pending", value: "PENDING" },
        { label: "Rejected", value: "REJECTED" },
      ],
    },
  ],
};

export default function Talent() {
  return (
    <AdminDashboardLayout
      active="Bid"
      breadcrumbItems={[
        { label: "Dashboard", link: "/dashboard/" },
        { label: "Bid", link: "#" },
      ]}
      showSearch={false}
      mainClassName="mx-5"
    >
      <CustomTable {...customTableProps} />
    </AdminDashboardLayout>
  );
}