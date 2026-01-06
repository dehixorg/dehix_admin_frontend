import React, { Dispatch, SetStateAction, useEffect, useState, useMemo } from "react";
import { SearchComponent } from "../custom-table/FilterSearch";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Filter } from "lucide-react";
import {
  CustomTableChildComponentsProps,
  FilterDataType,
  FiltersArrayElem,
  HeaderActions,
} from "../custom-table/FieldTypes";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { HeaderActionComponent } from "./HeaderActionsComponent";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";

interface Params extends CustomTableChildComponentsProps {
  filterData?: Array<{
    type: FilterDataType;
    name: string;
    textValue: string;
    options: Array<{
      value: string;
      label: string;
    }>;
    arrayName?: string;
  }>;
  setFilters: (filters: FiltersArrayElem[]) => void;
  tableHeaderActions?: Array<HeaderActions | React.FC>;
  isSearch: boolean;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  sortByArr: Array<{ label: string; fieldName: string }>;
  setSortByValue: (val: string) => void;
  setSortOrder: (val: 1 | -1) => void;
}

export const FilterTable = ({
  filterData,
  setFilters,
  tableHeaderActions,
  search,
  setSearch,
  sortByArr,
  setSortByValue,
  setSortOrder,
  isSearch,
  refetch,
}: Params) => {
  const initializeFiltersArray = () => {
    const filtersArray: FiltersArrayElem[] = [];
    filterData?.forEach((filter) =>
      filtersArray.push({
        fieldName: filter.name,
        textValue: filter.textValue,
        value: "",
        arrayName: filter.arrayName,
      })
    );
    return filtersArray;
  };

  const [isOpen, setIsOpen] = useState(false);

  const [selectedFilters, setSelectedFilters] = useState<FiltersArrayElem[]>(
    () => initializeFiltersArray()
  );
  const [sortChildState, setSortChildState] = useState<{
    value: string;
    order: 1 | -1;
  }>({ value: "createdAt", order: 1 });

  useEffect(() => {
    return () => {
      setFilters([]);
    };
  }, []);

  // Generate search suggestions from filter options
  const searchOptions = useMemo(() => {
    const options: { value: string; label: string }[] = [];
    
    // Add options from all filters
    filterData?.forEach((filter) => {
      filter.options.forEach((option) => {
        options.push({
          value: option.value,
          label: option.label
        });
      });
    });
    
    return options;
  }, [filterData]);

  const handleSearchSelect = (value: string) => {
    console.log('Selected search option:', value);
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-border bg-background text-foreground rounded-lg">
      {/* Search Bar */}
      {isSearch && (
        <div className="w-1/3 mr-4 relative">
          <SearchComponent 
            searchValue={search} 
            setSearchValue={setSearch} 
            options={searchOptions}
            onSelectOption={handleSearchSelect}
          />
        </div>
      )}

      {/* Filters and Actions */}
      <div className="flex flex-grow items-center justify-between gap-4">
        <HeaderActionComponent
          headerActions={tableHeaderActions}
          refetch={refetch}
        />

        {/* Filter Button */}
        {filterData && filterData.length > 0 && (
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </SheetTrigger>

            {/* Sliding Filter Panel */}
            <SheetContent
              side="right"
              className="w-80 p-4 space-y-6 overflow-y-scroll"
            >
              <div className="pb-4 border-b border-border">
                <SheetTitle>Filter & Sort</SheetTitle>
                <SheetDescription>
                  Filter and sort the data below.
                </SheetDescription>
              </div>

              {/* Filters */}
              {filterData?.map((filter, index) => (
                <div key={index} className="space-y-4">
                  <h4 className="text-lg font-semibold">{filter.textValue}</h4>
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
                      className="space-y-2"
                    >
                      {filter.options.map((opt, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <RadioGroupItem value={opt.value} id={opt.value} />
                          <Label htmlFor={opt.value}>{opt.label}</Label>
                        </div>
                      ))}
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
                                    // Parse existing values
                                    const currentValues = filterVal.value
                                      .split(',')
                                      .filter((v) => v.trim() !== '');
                                    
                                    // Toggle the clicked option
                                    let newValue: string;
                                    if (currentValues.includes(opt.value)) {
                                      newValue = currentValues
                                        .filter((v) => v !== opt.value)
                                        .join(',');
                                    } else {
                                      newValue = [...currentValues, opt.value].join(',');
                                    }
                                    
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
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {opt.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Sorting */}
              {sortByArr.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold">Sort By</h4>
                  <RadioGroup
                    value={sortChildState.value}
                    onValueChange={(value) => {
                      setSortChildState({ ...sortChildState, value });
                    }}
                    className="space-y-2"
                  >
                    {sortByArr.map((sortVal, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={sortVal.fieldName}
                          id={sortVal.fieldName}
                        />
                        <Label htmlFor={sortVal.fieldName}>{sortVal.label}</Label>
                      </div>
                    ))}
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={"createdAt"} id={"createdAt"} />
                      <Label htmlFor={"createdAt"}>Most Recent</Label>
                    </div>
                  </RadioGroup>
                  <RadioGroup
                    value={sortChildState.order.toString()}
                    onValueChange={(value) => {
                      setSortChildState({
                        ...sortChildState,
                        order: value === "1" ? 1 : -1,
                      });
                    }}
                    className="flex space-x-4"
                  >
                    {["-1", "1"].map((order) => (
                      <div key={order} className="flex items-center space-x-2">
                        <RadioGroupItem value={order} id={order} />
                        <Label htmlFor={order}>
                          {order === "-1" ? "Newest First" : "Oldest First"}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col space-y-4 pt-4 border-t border-border">
                <Button
                  onClick={() => {
                    setIsOpen(false);
                    setFilters(selectedFilters);
                    setSortByValue(sortChildState.value);
                    setSortOrder(sortChildState.order);
                  }}
                >
                  Apply Filters
                </Button>
                <Button
                  variant="link"
                  className="text-sm text-muted-foreground"
                  onClick={() => {
                    setIsOpen(false);
                    setSelectedFilters(initializeFiltersArray());
                    setFilters(initializeFiltersArray());
                  }}
                >
                  <ReloadIcon className="mr-2 h-4 w-4" /> Reset Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </div>
  );
};

export default FilterTable;