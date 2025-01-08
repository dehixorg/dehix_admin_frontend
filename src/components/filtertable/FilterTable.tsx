import React, { useEffect, useState } from "react";
import { SearchComponent } from "../FilterSearch";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Filter } from "lucide-react";
import { FilterDataType, FiltersArrayElem } from "../custom-table/FieldTypes";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";

type Params = {
  filterData?: Array<{
    type: FilterDataType;
    name: string;
    textValue: string;
    options: Array<{
      value: string;
      label: string;
    }>;
  }>;
  filters: FiltersArrayElem[];
  setFilters: (filters: FiltersArrayElem[]) => void;
};

const displayValue = (val: string) => {
  return `${val[0].toUpperCase()}${val.slice(1).replaceAll("_", " ")}`;
};

export const FilterTable = ({ filterData, filters, setFilters }: Params) => {
  const [isOpen, setIsOpen] = useState(false);

  const [selectedFilters, setSelectedFilters] = useState<FiltersArrayElem[]>(
    () => {
      if (filters.length > 0) return filters;
      let filtersArray: FiltersArrayElem[] = [];
      filterData?.forEach((filter) =>
        filtersArray.push({
          fieldName: filter.name,
          textValue: filter.textValue,
          value: "",
        })
      );
      return filtersArray;
    }
  );

  useEffect(() => {
    return () => {
      setFilters([]);
    };
  }, []);

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
          {!isOpen &&
            selectedFilters.map((filter, index) =>
              filter.value.split(",").map(
                (filterVal) =>
                  filterVal !== "" && (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full flex items-center gap-2 sm:px-2 sm:py-1 md:px-3 md:py-1 lg:px-3 lg:py-1 xl:px-3 xl:py-1"
                    >
                      {displayValue(filterVal)}
                      <button
                        className="ml-2 text-red-500"
                        onClick={() => {
                          const newSelectedFilters = selectedFilters.map(
                            (selectFilter) => {
                              if (selectFilter.fieldName === filter.fieldName)
                                if (selectFilter.value.includes(filterVal)) {
                                  const newFilterValue =
                                    selectFilter.value.replace(filterVal, "");
                                  return {
                                    ...selectFilter,
                                    value: newFilterValue,
                                  };
                                }
                              return selectFilter;
                            }
                          );
                          setSelectedFilters(newSelectedFilters);
                          setFilters(newSelectedFilters);
                        }}
                      >
                        ×
                      </button>
                    </span>
                  )
              )
            )}
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
            className="w-80 p-4 bg-white dark:bg-gray-900 space-y-4"
          >
            <div>
              <SheetTitle className="text-lg font-medium mb-0 text-gray-800 dark:text-gray-200">
                Filter
              </SheetTitle>
              <SheetDescription>Choose your filters</SheetDescription>
            </div>
            {filterData?.map((filter, index) => (
              <div
                key={index}
                className="w-full px-4 flex flex-col items-start justify-start gap-4"
              >
                <span>{filter.textValue}</span>
                {filter.type === FilterDataType.SINGLE ? (
                  <RadioGroup
                    value={
                      selectedFilters.find(
                        ({ fieldName }) => fieldName === filter.name
                      )?.value
                    }
                    onValueChange={(value) => {
                      const newSelectedFilter = selectedFilters.map(
                        (filterVal) => {
                          if (filterVal.fieldName === filter.name) {
                            return { ...filterVal, value: value };
                          }
                          return filterVal;
                        }
                      );
                      setSelectedFilters(newSelectedFilter);
                    }}
                    defaultValue=""
                    className="flex flex-col text-gray-600 text-sm items-start justify-start gap-3"
                  >
                    {filter.options.map((opt, index) => (
                      <div
                        key={index}
                        className="flex items-center cursor-pointer space-x-2"
                      >
                        <RadioGroupItem value={opt.value} id={opt.value} />
                        <Label
                          className="font-normal cursor-pointer"
                          htmlFor={opt.value}
                        >
                          {opt.label}
                        </Label>
                      </div>
                    ))}
                    <div className="flex items-center cursor-pointer space-x-2">
                      <RadioGroupItem value={""} id={"all"} />
                      <Label
                        className="font-normal cursor-pointer"
                        htmlFor={"all"}
                      >
                        {"All"}
                      </Label>
                    </div>
                  </RadioGroup>
                ) : (
                  <div className="space-y-2">
                    {filter.options.map((opt, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox
                          id={opt.value}
                          checked={selectedFilters
                            .find(({ fieldName }) => fieldName === filter.name)!
                            .value.includes(opt.value)}
                          onClick={(e) => {
                            const newSelectedFilters = selectedFilters.map(
                              (filterVal) => {
                                if (filterVal.fieldName === filter.name) {
                                  const newValue = filterVal.value.includes(
                                    opt.value
                                  )
                                    ? filterVal.value.replace(
                                        `${opt.value},`,
                                        ""
                                      )
                                    : `${filterVal.value}${opt.value},`;
                                  return { ...filterVal, value: newValue };
                                }
                                return filterVal;
                              }
                            );
                            setSelectedFilters(newSelectedFilters);
                          }}
                        />
                        <label
                          htmlFor={opt.value}
                          className="text-sm font-normal cursor-pointer text-gray-600 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {opt.label}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Apply Filters Button */}
            <button
              className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
              onClick={() => {
                setIsOpen(false);
                setFilters(selectedFilters);
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
