import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {Badge} from "@/components/ui/badge"
import { getStatusBadge } from "@/utils/common/utils";
import { toTitleCase } from "@/utils/common/utils";
interface DropdownProps {
  currentStatus: string; // Current status to display
  options: string[]; // Available options for dropdown
  onChange: (newStatus: string) => void; // Function to handle status change
}

const StatusDropdown: React.FC<DropdownProps> = ({
  currentStatus,
  options,
  onChange,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span>
  <Badge className={`${getStatusBadge(currentStatus)} cursor-pointer`}>
    {toTitleCase(currentStatus)}
  </Badge>
  </span>
</DropdownMenuTrigger>
      <DropdownMenuContent>
        {options.map((option, index) => (
          <DropdownMenuItem
            key={index}
            onClick={() => {
              if (option !== currentStatus) onChange(option);
            }}
            className={`cursor-pointer ${
              option === currentStatus ? "text-gray-400 cursor-not-allowed" : ""
            }`}
            disabled={option === currentStatus}
          >
            {toTitleCase(option)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StatusDropdown;
