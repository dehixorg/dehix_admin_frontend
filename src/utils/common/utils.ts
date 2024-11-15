import { BadgePlus, BadgeCheck, BadgeAlert, RotateCcw } from "lucide-react";
import React from "react";
export const getStatusBadge = (status: string | undefined) => {
    switch (status?.toLowerCase()) {
        case "accepted":
        return "bg-green-500 hover:bg-green-600" ;
        case "rejected":
          return "bg-red-500 hover:bg-red-600" ;
        case "pending":
            return   "bg-yellow-500 hover:bg-yellow-600" ;
        case "active":
            return "bg-blue-500 hover:bg-blue-600" ;
        case "completed":
            return "bg-green-500 hover:bg-green-600" ;
        case "interview":
            return "bg-green-500 hover:bg-green-600" ;
        case "panel":
            return "bg-gray-500 hover:bg-gray-600";
        default:
            return  "bg-gray-500 hover:bg-gray-600" ;
    }
  };

  export const getStatusIcon = (status: string): JSX.Element | null => {
    switch (status?.toLowerCase()) {
      case "added":
        return React.createElement(BadgePlus, { className: "text-yellow-500" });
      case "verified":
        return React.createElement(BadgeCheck, { className: "text-green-500" });
      case "rejected":
        return React.createElement(BadgeAlert, { className: "text-red-500" });
      case "reapplied":
        return React.createElement(RotateCcw, { className: "text-gray-500" });
      case "pending":
        return React.createElement(BadgePlus, { className: "text-yellow-500" });
      default:
        return null;
    }
  };