import React, { useState, useEffect } from "react";
import { SearchComponent } from "../Search";
import { CategoryFilter } from "../CategoryFilter";
import { SkillsFilter } from "../SkillsFilter";
import { DateFilter } from "../DateFilter";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Filter } from "lucide-react";

export const FilterTable: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Update selected filters
  const getSelectedFilters = () => {
    const filters = [];
    if (selectedCategory) filters.push(`Category: ${selectedCategory}`);
    if (selectedSkills.length > 0)
      filters.push(`Skills: ${selectedSkills.join(", ")}`);
    if (selectedDate)
      filters.push(`Date: ${selectedDate.toLocaleDateString()}`);
    return filters;
  };

  const [filters, setFilters] = useState<string[]>([]);

  useEffect(() => {
    setFilters(getSelectedFilters());
  }, [selectedCategory, selectedSkills, selectedDate]);

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white text-black dark:bg-black dark:text-white rounded-lg">
      {/* Search Bar */}
      <div className="w-1/3 mr-4">
        <SearchComponent />
      </div>

      {/* Filters */}
      <div className="w-2/3 flex items-center justify-between gap-4">
        {/* Badges for selected filters */}
        <div className="flex gap-2 mr-4 flex-wrap">
          {/* Added flex-wrap to allow wrapping of badges */}
          {filters.map((filter, index) => (
            <span
              key={index}
              className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full flex items-center gap-2 sm:px-2 sm:py-1 md:px-3 md:py-1 lg:px-3 lg:py-1 xl:px-3 xl:py-1"
            >
              {filter}{" "}
              <button
                onClick={() => {
                  // Remove filter when clicking the badge
                  if (filter.startsWith("Category:")) {
                    setSelectedCategory(null);
                  } else if (filter.startsWith("Skills:")) {
                    setSelectedSkills([]);
                  } else if (filter.startsWith("Date:")) {
                    setSelectedDate(null);
                  }
                }}
                className="ml-2 text-red-500"
              >
                ×
              </button>
            </span>
          ))}
        </div>

        {/* Filter Button */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <button className="p-2 bg-gray-200 dark:bg-gray-800 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700">
              <Filter className="w-5 h-5 text-gray-800 dark:text-gray-200" />
            </button>
          </SheetTrigger>

          {/* Sliding Filter Panel */}
          <SheetContent
            side="right"
            className="w-80 p-4 bg-white dark:bg-gray-900"
          >
            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">
              Filter
            </h3>

            {/* Category Filter */}
            <div className="mb-8">
              <CategoryFilter setSelectedCategory={setSelectedCategory} />
            </div>

            {/* Skills Filter */}
            <div className="mb-8">
              <SkillsFilter setSelectedSkills={setSelectedSkills} />
            </div>

            {/* Date Filter */}
            <div className="mb-8">
              <DateFilter setSelectedDate={setSelectedDate} />
            </div>

            {/* Apply Filters Button */}
            <button
              className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
              onClick={() => {
                setIsOpen(false);
                console.log("Filters Applied");
              }}
            >
              Apply Filters
            </button>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default FilterTable;
