"use client";

import { DownloadIcon, PackageOpen } from "lucide-react";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import React, { useCallback, useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { apiHelperService } from "@/services/customTable";
import { FieldType, FiltersArrayElem, Params } from "./FieldTypes";
import { CustomTableCell } from "./FieldComponents";
import { FilterTable } from "./FilterTable";
import { HeaderActionComponent } from "./HeaderActionsComponent";
import { ToolTip } from "../ToolTip";
import { TablePagination } from "./Pagination";
import { TableSelect } from "./TableSelect";
import { twMerge } from "tailwind-merge";
import { useToast } from "../ui/use-toast";
import { Messages } from "@/utils/common/enum";

export const CustomTable = ({
  title,
  fields,
  filterData,
  api,
  uniqueId,
  tableHeaderActions,
  mainTableActions,
  searchColumn,
  sortBy,
  isFilter = true,
  isDownload = false,
  emptyStateAction,
}: Params) => {
  // Define the data type for table rows
  type TableData = any; // Consider replacing 'any' with a proper interface for your data

  const [data, setData] = useState<TableData[]>([]);
  const [filteredData, setFilteredData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState<FiltersArrayElem[]>(
    []
  );
  // const [sortByState, setSortByState] = useState<Array<{label: string, fieldName: string}>>(sortBy || [])
  const [sortByValue, setSortByValue] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Handle sort order change from FilterTable (converts 1 | -1 to "asc" | "desc")
  const handleSortOrderChange = useCallback((val: 1 | -1) => {
    setSortOrder(val === 1 ? "asc" : "desc");
  }, []);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);

  const { toast } = useToast();

  // Function to sort search results by relevance across all content
  const sortBySearchRelevance = (data: TableData[], searchTerm: string) => {
    if (!searchTerm) return [...data];

    const searchLower = searchTerm.toLowerCase();

    return [...data].sort((a, b) => {
      // Check for exact matches first - search across ALL fields
      const aExactMatch = Object.keys(a).some((key) => {
        const value = a[key];
        if (value === null || value === undefined) return false;

        // Handle arrays (like for ARRAY_VALUE field type)
        if (Array.isArray(value)) {
          const arrayField = fields.find((f) => f.fieldName === key);
          if (arrayField?.arrayName) {
            const arrayValues = value
              .map((val: any) => {
                const arrayName = arrayField.arrayName as string;
                return val[arrayName] || val;
              })
              .join(" ");
            return arrayValues.toLowerCase() === searchLower;
          }
          return value.join(" ").toLowerCase() === searchLower;
        }

        // Handle nested objects (but not arrays, which are handled above)
        if (typeof value === "object" && !Array.isArray(value)) {
          const stringValue = JSON.stringify(value);
          return stringValue.toLowerCase() === searchLower;
        }

        return String(value).toLowerCase() === searchLower;
      });

      const bExactMatch = Object.keys(b).some((key) => {
        const value = b[key];
        if (value === null || value === undefined) return false;

        // Handle arrays (like for ARRAY_VALUE field type)
        if (Array.isArray(value)) {
          const arrayField = fields.find((f) => f.fieldName === key);
          if (arrayField?.arrayName) {
            const arrayValues = value
              .map((val: any) => {
                const arrayName = arrayField.arrayName as string;
                return val[arrayName] || val;
              })
              .join(" ");
            return arrayValues.toLowerCase() === searchLower;
          }
          return value.join(" ").toLowerCase() === searchLower;
        }

        // Handle nested objects (but not arrays, which are handled above)
        if (typeof value === "object" && !Array.isArray(value)) {
          const stringValue = JSON.stringify(value);
          return stringValue.toLowerCase() === searchLower;
        }

        return String(value).toLowerCase() === searchLower;
      });

      if (aExactMatch && !bExactMatch) return -1;
      if (!aExactMatch && bExactMatch) return 1;

      // Then check for partial matches - search across ALL fields
      const aPartialMatch = Object.keys(a).some((key) => {
        const value = a[key];
        if (value === null || value === undefined) return false;

        // Handle arrays (like for ARRAY_VALUE field type)
        if (Array.isArray(value)) {
          const arrayField = fields.find((f) => f.fieldName === key);
          if (arrayField?.arrayName) {
            const arrayValues = value
              .map((val: any) => {
                const arrayName = arrayField.arrayName as string;
                return val[arrayName] || val;
              })
              .join(" ");
            return arrayValues.toLowerCase().includes(searchLower);
          }
          return value.join(" ").toLowerCase().includes(searchLower);
        }

        // Handle nested objects (but not arrays, which are handled above)
        if (typeof value === "object" && !Array.isArray(value)) {
          const stringValue = JSON.stringify(value);
          return stringValue.toLowerCase().includes(searchLower);
        }

        return String(value).toLowerCase().includes(searchLower);
      });

      const bPartialMatch = Object.keys(b).some((key) => {
        const value = b[key];
        if (value === null || value === undefined) return false;

        // Handle arrays (like for ARRAY_VALUE field type)
        if (Array.isArray(value)) {
          const arrayField = fields.find((f) => f.fieldName === key);
          if (arrayField?.arrayName) {
            const arrayValues = value
              .map((val: any) => {
                const arrayName = arrayField.arrayName as string;
                return val[arrayName] || val;
              })
              .join(" ");
            return arrayValues.toLowerCase().includes(searchLower);
          }
          return value.join(" ").toLowerCase().includes(searchLower);
        }

        // Handle nested objects (but not arrays, which are handled above)
        if (typeof value === "object" && !Array.isArray(value)) {
          const stringValue = JSON.stringify(value);
          return stringValue.toLowerCase().includes(searchLower);
        }

        return String(value).toLowerCase().includes(searchLower);
      });

      if (aPartialMatch && !bPartialMatch) return -1;
      if (!aPartialMatch && bPartialMatch) return 1;

      // If both have same match type, maintain their relative order
      return 0;
    });
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      window.scrollTo(0, 0);
      const params: Record<string, any> = {
        page: page,
        limit: limit,
      };

      // Build filters string only for filters with values
      const activeFilters = selectedFilters.filter(
        (filter) =>
          filter.value !== undefined &&
          filter.value !== null &&
          filter.value !== ""
      );

      if (activeFilters.length > 0) {
        params["filters"] = activeFilters
          .map((filter) => `filter[${filter.fieldName}]`)
          .join(",");
      }

      selectedFilters.forEach((filter) => {
        if (filter.arrayName) {
          params[`filter[${filter.fieldName}.${filter.arrayName}]`] =
            filter.value;
        } else {
          // Convert isActive filter value to boolean
          if (filter.fieldName === "isActive") {
            params[`filter[${filter.fieldName}]`] = filter.value === "true";
          } else {
            params[`filter[${filter.fieldName}]`] = filter.value;
          }
        }
      });

      if (search) {
        params["filter[search][value]"] = search;
        params["filter[search][columns]"] = searchColumn?.join(",");
      }

      params["filter[sortBy]"] = sortByValue;
      params["filter[sortOrder]"] = sortOrder;

      const response = await apiHelperService.fetchData(api, params);

      const responseData = Array.isArray(response.data.data)
        ? response.data.data
        : [];

      if (search && searchColumn && searchColumn.length > 0) {
        const sortedData = sortBySearchRelevance(responseData, search);
        setFilteredData(sortedData);
      } else {
        setFilteredData(responseData);
      }

      setData(responseData);
    } catch (error) {
      toast({
        title: "Error",
        description: Messages.FETCH_ERROR(title || ""),
        variant: "destructive", // Red error message
      });
    } finally {
      setLoading(false);
    }
  }, [
    api,
    limit,
    page,
    search,
    selectedFilters,
    sortByValue,
    sortOrder,
    title,
    searchColumn,
  ]);

  useEffect(() => {
    const safeData = Array.isArray(data) ? data : [];
    if (search) {
      const sortedData = sortBySearchRelevance(safeData, search);
      setFilteredData(sortedData);
    } else {
      setFilteredData([...safeData]);
    }
  }, [search, data]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setPage(1);
  }, [selectedFilters, search, limit]);

  const setFiltersUtils = (filters: FiltersArrayElem[]) => {
    setSelectedFilters(filters);
  };

  const setPageUtils = (page: number) => {
    setPage(page);
  };

  const setLimitUtils = (limit: number) => {
    setLimit(limit);
  };

  const handleDownload = () => {
    if (!Array.isArray(data) || data.length === 0) return;

    let content = "";

    const headings: string[] = [];
    fields.forEach((field) => {
      if (field.type !== FieldType.ACTION) headings.push(field.textValue);
    });
    content += headings.join(",") + "\n";

    data.forEach((elem) => {
      const fieldValues: string[] = [];
      fields.forEach((field) => {
        if (field.fieldName && field.type !== FieldType.ACTION) {
          if (field.type === FieldType.ARRAY_VALUE)
            fieldValues.push(
              (elem[field.fieldName] as Record<string, any>[])
                .map((val) => val[field.arrayName!])
                .join("|")
            );
          else fieldValues.push(elem[field.fieldName]);
        }
      });
      content += fieldValues.join(",") + "\n";
    });

    const blob = new Blob([content], { type: "text/csv" });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "data.csv";

    a.click();
  };

  const refetch = () => {
    fetchData();
  };

  return (
    <div className="px-4">
      <div className="w-full flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-300 tracking-wider">
          {title}
        </h1>
        <HeaderActionComponent
          headerActions={mainTableActions}
          refetch={refetch}
        />
        <div className="flex items-center gap-2">
          <TableSelect
            currValue={limit}
            label="Items Per Page"
            values={[10, 25, 50, 100]}
            setCurrValue={setLimitUtils}
          />
          {data.length > 0 && (
            <span className="text-sm text-gray-500">
              Showing {(page - 1) * limit + 1} to{" "}
              {Math.min(page * limit, data.length * page)} of{" "}
              {data.length * page} entries
            </span>
          )}
        </div>
        {/* Download Button */}
        {isDownload && (
          <span
            className="w-fit text-sm text-gray-600 mx-4 bg-gray-100 border-gray-400 cursor-pointer hover:bg-gray-200 transition-colors shadow-sm py-2.5 px-3 rounded-sm"
            onClick={handleDownload}
          >
            <DownloadIcon className="inline mr-1 size-4 dark:text-gray-900" />
            Download
          </span>
        )}
      </div>
      <div className="mb-8 mt-4">
        <Card>
          {isFilter && (
            <FilterTable
              filterData={filterData}
              tableHeaderActions={tableHeaderActions}
              setFilters={setFiltersUtils}
              search={search}
              setSearch={setSearch}
              sortByArr={sortBy || []}
              setSortByValue={setSortByValue}
              setSortOrder={handleSortOrderChange}
              isSearch={searchColumn ? searchColumn.length > 0 : false}
              refetch={refetch}
            />
          )}
          <div className="lg:overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {fields.map((field) => (
                    <TableHead key={field.fieldName}>
                      {field.tooltip ? (
                        <ToolTip
                          trigger={field.textValue}
                          content={field.tooltipContent || ""}
                        />
                      ) : (
                        field.textValue
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <>
                    {[...Array(10)].map((_, i) => (
                      <TableRow key={i}>
                        {fields.map((field) => (
                          <TableCell key={field.fieldName}>
                            <Skeleton className="h-5 w-20" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </>
                ) : filteredData?.length > 0 ? (
                  filteredData.map((elem: any) => (
                    <TableRow key={elem._id}>
                      {fields.map((field, index) => (
                        <TableCell
                          key={field.fieldName}
                          className={twMerge(
                            "text-gray-900 dark:text-gray-300",
                            field.className
                          )}
                          width={field.width}
                        >
                          <CustomTableCell
                            fieldData={field}
                            value={
                              field.fieldName
                                ? elem[field.fieldName]
                                : field.type === FieldType.CUSTOM
                                  ? elem
                                  : undefined
                            }
                            id={elem[uniqueId]}
                            refetch={refetch}
                            key={index}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      {emptyStateAction ? (
                        <div className="text-center py-16 w-full">
                          <PackageOpen
                            className="mx-auto text-gray-400 mb-4"
                            size="80"
                          />
                          <p className="text-gray-600 mb-6 text-lg font-medium">
                            No leaderboard contests yet
                          </p>
                          <p className="text-gray-500 mb-8">
                            Create your first leaderboard contest to get started
                          </p>
                          {React.createElement(emptyStateAction, {
                            refetch: fetchData,
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-10 w-full mt-10">
                          <PackageOpen
                            className="mx-auto text-gray-500"
                            size="100"
                          />
                          <p className="text-gray-500">
                            No data available.
                            <br /> This feature will be available soon.
                            <br />
                            Here you can get directly hired for different roles.
                          </p>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
        <TablePagination
          page={page}
          setPage={setPageUtils}
          isNextAvailable={data?.length >= limit}
        />
      </div>
    </div>
  );
};
