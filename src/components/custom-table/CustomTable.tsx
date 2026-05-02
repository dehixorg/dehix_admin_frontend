import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FieldType,
  FiltersArrayElem,
  Params,
} from "./FieldTypes";
import { apiHelperService } from "@/services/customTable";
import { CustomTableCell } from "./FieldComponents";
import { TablePagination } from "./Pagination";
import { FilterTable } from "./FilterTable";
import { useToast } from "@/hooks/use-toast";
import { Messages } from "@/utils/common/enum";
import { Skeleton } from "@/components/ui/skeleton";
import { HeaderActionComponent } from "./HeaderActionsComponent";
import { DownloadIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { ToolTip } from "../ToolTip";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { TableSelect } from "./TableSelect";

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
  type TableData = any;

  const [data, setData] = useState<TableData[]>([]);
  const [filteredData, setFilteredData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState<FiltersArrayElem[]>(
    []
  );
  const [sortByValue, setSortByValue] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

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

  // Handle client-side search filtering when data or search term chang
  useEffect(() => {
    const safeData = Array.isArray(data) ? data : [];
    if (search) {
      const sortedData = sortBySearchRelevance(safeData, search);
      setFilteredData(sortedData);
    } else {
      setFilteredData([...safeData]);
    }
  }, [search, data]);

  const lastFetchParamsRef = useRef<string>("");

  useEffect(() => {
    const currentParams = {
      api,
      page,
      limit,
      selectedFilters,
      search,
      sortByValue,
      sortOrder,
      searchColumn,
    };

    const paramsString = JSON.stringify(currentParams, (key, value) => {
      if (key === "fields" || key === "tableHeaderActions" || key === "mainTableActions") return undefined;
      return value;
    });

    if (lastFetchParamsRef.current !== paramsString) {
      lastFetchParamsRef.current = paramsString;
      fetchData();
    }
  }, [
    fetchData,
    api,
    page,
    limit,
    selectedFilters,
    search,
    sortByValue,
    sortOrder,
    searchColumn,
  ]);

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
    <div className="px-4 sm:px-0 w-full" style={{ width: '100%' }}>
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 py-3">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-300 tracking-wider text-center sm:text-left">
          {title}
        </h1>
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 sm:gap-6 w-full sm:w-auto">
          <HeaderActionComponent
            headerActions={mainTableActions}
            refetch={refetch}
          />
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <TableSelect
                currValue={limit}
                label="Items Per Page"
                values={[10, 25, 50, 100]}
                setCurrValue={setLimitUtils}
              />
            </div>
            {data.length > 0 && (
              <div className="text-[10px] sm:text-xs lowercase text-gray-500 whitespace-nowrap pt-1 sm:pt-0.5">
                {`${data.length} items found`}
              </div>
            )}
            {isDownload && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 gap-1 rounded-full border-border/70 bg-background/80 shadow-sm transition-all hover:bg-accent hover:shadow"
                onClick={handleDownload}
              >
                <DownloadIcon className="size-4" />
                Download
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="mb-8 mt-4 w-full">
        <Card className="w-full" style={{ width: '100%' }}>
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
          <div className="w-full overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  {fields.map((field) => (
                    <TableHead key={field.fieldName} className="px-4 py-3 text-sm font-medium">
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
                      <TableRow key={i} className="hover:bg-transparent">
                        {fields.map((field) => (
                          <TableCell key={field.fieldName}>
                            <Skeleton className="h-5 w-full max-w-[140px] rounded-full" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </>
                ) : filteredData?.length > 0 ? (
                  filteredData.map((elem: any) => (
                    <TableRow
                      key={elem[uniqueId]}
                      className="border-b border-border/50 transition-colors hover:bg-muted/30"
                    >
                      {fields.map((field, _index) => (
                        <TableCell
                          key={field.fieldName}
                          className={twMerge(
                            "text-gray-900 dark:text-gray-300 px-4 py-3 text-sm",
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
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={fields.length}
                      className="h-32 text-center"
                    >
                      <div className="flex flex-col items-center justify-center gap-4">
                        <span className="text-muted-foreground">No data found</span>
                        {emptyStateAction && React.createElement(emptyStateAction, { refetch: fetchData })}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="border-t border-border/50 px-4 py-4">
            <TablePagination
              page={page}
              setPage={setPageUtils}
              isNextAvailable={data.length === limit}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

