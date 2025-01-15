"use client";

import { DownloadIcon, PackageOpen } from "lucide-react";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useEffect, useState } from "react";
import { apiHelperService } from "@/services/customTable";
import { FieldType, FiltersArrayElem, Params } from "./FieldTypes";
import { CustomTableCell } from "./FieldComponents";
import FilterTable from "./FilterTable";
import { HeaderActionComponent } from "./HeaderActionsComponent";
import { ToolTip } from "../ToolTip";
import { TablePagination } from "./Pagination";
import { TableSelect } from "./TableSelect";

export const CustomTable = ({
  fields,
  filterData,
  api,
  uniqueId,
  tableHeaderActions,
  mainTableActions,
  searchColumn,
  isFilter = true,
  isDownload = false,
}: Params) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState<FiltersArrayElem[]>(
    []
  );
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        window.scrollTo(0, 0);
        let params: Record<string, any> = {
          filters: "",
          page: page,
        };
        selectedFilters.map((filter) => {
          params["filters"] += [`filter[${filter.fieldName}],`];
        });
        selectedFilters.map((filter) => {
          params[`filter[${filter.fieldName}]`] = filter.value;
        });
        if (search != "") {
          params["filter[search][value]"] = search;
          params["filter[search][columns]"] = searchColumn?.join(",");
        }
        const response = await apiHelperService.fetchData(api, params);
        setData(response.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedFilters, search, page, limit]);

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
    let content = "";

    let headings: string[] = [];
    fields.forEach((field) => {
      if (field.type !== FieldType.ACTION) headings.push(field.textValue);
    });
    content += headings.join(",") + "\n";

    data.forEach((elem) => {
      let fieldValues: string[] = [];
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
    console.log(content);

    const blob = new Blob([content], { type: 'text/csv' });
    
    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    
    a.href = url;
    a.download = 'data.csv';

    a.click();
  };

  return (
    <div className="px-4">
      <div className="w-full flex items-center justify-between">
        <HeaderActionComponent headerActions={mainTableActions} />
        <TableSelect
          currValue={limit}
          label="Items Per Page"
          values={[10, 15, 20, 25]}
          setCurrValue={setLimitUtils}
        />
        {/* Download Button */}
        {isDownload && (
          <span
            className="w-fit text-sm text-gray-600 mx-4 bg-gray-100 border-gray-400 cursor-pointer hover:bg-gray-200 transition-colors shadow-sm py-2.5 px-3 rounded-sm"
            onClick={handleDownload}
          >
            <DownloadIcon className="inline mr-1 size-4" />
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
            />
          )}
          <div className="lg:overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {fields.map((field, index) => (
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
                        {fields.map((field, index) => (
                          <TableCell key={field.fieldName}>
                            <Skeleton className="h-5 w-20" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </>
                ) : data?.length > 0 ? (
                  data.map((elem: any, index: number) => (
                    <TableRow key={elem._id}>
                      {fields.map((field, index) => (
                        <TableCell
                          key={field.fieldName}
                          className={field.className}
                          width={field.width}
                        >
                          <CustomTableCell
                            fieldData={field}
                            value={
                              field.fieldName
                                ? elem[field.fieldName]
                                : undefined
                            }
                            id={elem[uniqueId]}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
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
          isNextAvailable={data?.length >= 20 || true}
        />
      </div>
    </div>
  );
};
