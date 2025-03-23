import React from "react";
import { Input } from "@/components/ui/input";

export const SearchComponent: React.FC = () => {
  return (
    <div className="flex items-center space-x-2">
      <Input
        placeholder="Search..."
        className="h-10 w-full rounded-lg px-4 py-2 text-sm bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border-gray-300 dark:border-gray-600 focus:ring-blue-500"
      />
      <span className="text-gray-500 dark:text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35M10.5 16.5a6 6 0 100-12 6 6 0 000 12z"
          />
        </svg>
      </span>
    </div>
  );
};
