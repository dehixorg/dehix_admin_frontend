import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

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
        <Button variant="secondary" className="w-32">{currentStatus}</Button>
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
            {option}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StatusDropdown;
