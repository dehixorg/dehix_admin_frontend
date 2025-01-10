"use client";

import { PackageOpen } from "lucide-react";
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
import { FiltersArrayElem, Params } from "./FieldTypes";
import { CustomTableCell } from "./FieldComponents";
import FilterTable from "./FilterTable";
import { HeaderActionComponent } from "./HeaderActionsComponent";

export const CustomTable = ({
  fields,
  filterData,
  api,
  uniqueId,
  tableHeaderActions,
  mainTableActions,
  searchColumn
}: Params) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState<FiltersArrayElem[]>([])
  const [search, setSearch] = useState<string>("")

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        let filters: Record<string, any> = {
          filters: ''
        }
        selectedFilters.map((filter) => {
          filters['filters'] += [`filter[${filter.fieldName}],`]
        })
        selectedFilters.map((filter) => {
          filters[`filter[${filter.fieldName}]`] = filter.value
        })
        if(search != '') {
          filters['filter[search][value]'] = search
          filters['filter[search][columns]'] = searchColumn?.join(',')
        }
        console.log(filters)
        const response = await apiHelperService.fetchData(api, filters);
        setData(response.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();

  }, [selectedFilters, search]);

  const setFilters = (filters: FiltersArrayElem[]) => {
    setSelectedFilters(filters)
  }

  return (
    <div className="px-4">
      <HeaderActionComponent headerActions={mainTableActions} />
      <div className="mb-8 mt-4">
        <Card>
          <FilterTable filterData={filterData} filters={selectedFilters} tableHeaderActions={tableHeaderActions} setFilters={setFilters} search={search} setSearch={setSearch} />
          <div className="lg:overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {fields.map((field, index) => (
                    <TableHead key={field.fieldName}>
                      {field.textValue}
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
      </div>
    </div>
  );
};
