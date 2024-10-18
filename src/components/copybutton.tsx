"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react"; // Lucide React icons

import { Button } from "@/components/ui/button"; // Assuming you have a Button component
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"; // Import Tooltip components

interface CopyButtonProps {
  id: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ id }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);

      // Revert back to original state after 2 seconds
      setTimeout(() => setCopied(false), 1000);
    } catch (error) {
      console.error("Failed to copy ID to clipboard:", error);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="relative inline-block">
          <Button
            onClick={handleCopy}
            variant="ghost"
            className="p-3 h-4 py-3  border-none flex items-center text-sm"
          >
            {copied ? (
              <Check className="mr-1" size={16} />
            ) : (
              <Copy className="mr-1" size={16} />
            )}
          </Button>
        </div>
      </TooltipTrigger>

      <TooltipContent>Copy</TooltipContent>
    </Tooltip>
  );
};

export default CopyButton;
