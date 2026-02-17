import React, { Dispatch, SetStateAction, useEffect, useState, useMemo } from "react";
import { SearchComponent } from "../custom-table/FilterSearch";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CheckCircle2, Filter, Sparkles } from "lucide-react";

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
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";

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
          label: option.label,
        });
      });
    });

    return options;
  }, [filterData]);

  const handleSearchSelect = (_value: string) => {
    // Search option selection can be used for analytics/hints in the future.
  };

  const selectedFilterCount = useMemo(() => {
    return selectedFilters.reduce((acc, filter) => {
      if (!filter.value) return acc;
      if (filter.value.includes(",")) {
        return acc + filter.value.split(",").filter((v) => v.trim() !== "").length;
      }
      return acc + 1;
    }, 0);
  }, [selectedFilters]);

  const selectedFilterLabels = useMemo(() => {
    const labels: string[] = [];

    selectedFilters.forEach((selected) => {
      if (!selected.value) return;
      const sourceFilter = filterData?.find((f) => f.name === selected.fieldName);
      if (!sourceFilter) return;

      selected.value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean)
        .forEach((val) => {
          const option = sourceFilter.options.find((opt) => opt.value === val);
          labels.push(`${sourceFilter.textValue}: ${option?.label || val}`);
        });
    });

    return labels;
  }, [selectedFilters, filterData]);

  return (
    <div className="flex flex-col gap-3 rounded-xl p-4 text-foreground md:flex-row md:items-center md:justify-between">
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
              <Button variant="outline" className="gap-2 ml-auto">
                <Filter className="h-4 w-4" />
                Filters
                {selectedFilterCount > 0 && (
                  <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-xs">
                    {selectedFilterCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>

            {/* Sliding Filter Panel */}
            <SheetContent
              side="right"
              className="w-[92vw] max-w-[430px] space-y-5 overflow-y-auto p-4"
            >
              <div className="space-y-3 border-b border-border pb-4">
                <SheetTitle>Filter & Sort</SheetTitle>
                <SheetDescription>
                  Filter and sort the data below.
                </SheetDescription>
                <div className="relative overflow-hidden rounded-lg border border-primary/20 bg-gradient-to-r from-primary/10 via-cyan-500/5 to-transparent p-3">
                  <div className="absolute -right-5 -top-5 h-14 w-14 rounded-full bg-primary/15" />
                  <div className="absolute -bottom-6 right-6 h-12 w-12 rounded-full bg-cyan-400/10" />
                  <div className="relative flex items-start gap-2">
                    <Sparkles className="mt-0.5 h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Smart Filters</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Pick options below to quickly focus on relevant rows.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Active Selection
                  </p>
                  {selectedFilterLabels.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedFilterLabels.slice(0, 6).map((label) => (
                        <Badge key={label} variant="secondary" className="text-[10px]">
                          {label}
                        </Badge>
                      ))}
                      {selectedFilterLabels.length > 6 && (
                        <Badge variant="outline" className="text-[10px]">
                          +{selectedFilterLabels.length - 6} more
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 rounded-md border border-dashed border-border px-2 py-1.5 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      No filters selected yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Filters */}
              {filterData?.map((filter, index) => (
                <Card key={index} className="border-border/60 bg-card/60 shadow-none">
                  <CardContent className="space-y-4 p-4">
                    <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      {filter.textValue}
                    </h4>
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
                        {filter.options.map((opt, index) => {
                          const selectedValue = selectedFilters.find(
                            ({ fieldName }) => fieldName === filter.name
                          )?.value;
                          const isSelected = selectedValue === opt.value;

                          return (
                            <div
                              key={index}
                              className={cn(
                                "flex items-center space-x-2 rounded-lg border px-2.5 py-2 transition-colors",
                                isSelected
                                  ? "border-primary/40 bg-primary/10"
                                  : "border-transparent hover:border-border hover:bg-muted/40"
                              )}
                            >
                              <RadioGroupItem value={opt.value} id={opt.value} />
                              <Label htmlFor={opt.value}>{opt.label}</Label>
                            </div>
                          );
                        })}
                      </RadioGroup>
                    ) : (
                      <div className="space-y-2">
                        {filter.options.map((opt, index) => {
                          const selectedValue = selectedFilters.find(
                            ({ fieldName }) => fieldName === filter.name
                          )?.value;
                          const currentValues = (selectedValue || "")
                            .split(",")
                            .map((v) => v.trim())
                            .filter(Boolean);
                          const isChecked = currentValues.includes(opt.value);

                          return (
                            <div
                              key={index}
                              className={cn(
                                "flex items-center space-x-2 rounded-lg border px-2.5 py-2 transition-colors",
                                isChecked
                                  ? "border-primary/40 bg-primary/10"
                                  : "border-transparent hover:border-border hover:bg-muted/40"
                              )}
                            >
                              <Checkbox
                                id={opt.value}
                                checked={isChecked}
                                onClick={(_e) => {
                                  const newSelectedFilters = selectedFilters.map(
                                    (filterVal) => {
                                      if (filterVal.fieldName === filter.name) {
                                        const currentValues = filterVal.value
                                          .split(",")
                                          .filter((v) => v.trim() !== "");

                                        let newValue: string;
                                        if (currentValues.includes(opt.value)) {
                                          newValue = currentValues
                                            .filter((v) => v !== opt.value)
                                            .join(",");
                                        } else {
                                          newValue = [...currentValues, opt.value].join(",");
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
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {/* Sorting */}
              {sortByArr.length > 0 && (
                <Card className="border-border/60 bg-card/60 shadow-none">
                  <CardContent className="space-y-4 p-4">
                    <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      Sort By
                    </h4>
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
                    </RadioGroup>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="sticky bottom-0 flex flex-col space-y-3 border-t border-border bg-background/95 pt-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
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
                  variant="outline"
                  className="text-sm"
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