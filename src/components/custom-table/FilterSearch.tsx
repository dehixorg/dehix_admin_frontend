import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"; 
import { Search } from "lucide-react"; 

export const SearchComponent: React.FC = () => {
  return (
    <div className="relative w-full">
      <Input
        placeholder="Search..."
        className="h-10 w-full rounded-lg px-4 py-2 text-sm bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border-gray-300 dark:border-gray-600 focus:ring-blue-500 pr-10"
      />
      {/* Search Button Icon inside the Input */}
      <Button
        variant="link"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
        aria-label="Search"
      >
        <Search className="h-5 w-5" />
      </Button>
    </div>
  );
};
