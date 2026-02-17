import React, { Dispatch, SetStateAction, useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

type SearchOption = {
  value: string;
  label: string;
};

type Params = {
  searchValue: string;
  setSearchValue: Dispatch<SetStateAction<string>>;
  options?: SearchOption[];
  onSelectOption?: (value: string) => void;
};

export const SearchComponent = ({ 
  searchValue, 
  setSearchValue, 
  options = [],
  onSelectOption
}: Params) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const value = formData.get('search') as string;
    setSearchValue(value);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <form onSubmit={handleSubmit} className="relative">
        <Input
          name="search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => setIsDropdownOpen(true)}
          placeholder="Search..."
          className="h-10 w-full rounded-lg px-4 py-2 text-sm bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border-gray-300 dark:border-gray-600 focus:ring-blue-500 pr-10"
        />
        {searchValue && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-8 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            onClick={() => {
              setSearchValue('');
              setIsDropdownOpen(false);
            }}
          >
            <X className="h-4 w-4 text-gray-500" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
          aria-label="Search"
          type="submit"
        >
          <Search className="h-4 w-4" />
        </Button>
      </form>

      {isDropdownOpen && filteredOptions.length > 0 && (
        <div className="absolute z-50 w-full mb-1 bottom-full bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto">
          {filteredOptions.map((option) => (
            <div
              key={option.value}
              className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              onClick={() => {
                setSearchValue(option.label);
                onSelectOption?.(option.value);
                setIsDropdownOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
