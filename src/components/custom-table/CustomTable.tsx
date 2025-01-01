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
import { FieldComponentProps, FieldType, Params } from "./FieldTypes";
import { ArrayValueField, DateTimeField, DeleteButton, LinkField, TextField, ToggleField } from "./FieldComponents";

const mapTypeToComponent = (type: FieldType) => {
  switch (type) {
    case FieldType.DATETIME:
      return DateTimeField;
    case FieldType.TEXT:
      return TextField;
    case FieldType.DELETE:
      return DeleteButton;
    case FieldType.LINK:
      return LinkField;
    case FieldType.ARRAY_VALUE:
      return ArrayValueField;
    case FieldType.TOGGLE:
      return ToggleField;
    default:
      return TextField;
  }
};

const CustomTableCell = ({ value, fieldData, id }: FieldComponentProps) => {
  const FieldComponentToRender = mapTypeToComponent(fieldData.type);
  return <FieldComponentToRender fieldData={fieldData} value={value} id={id} />;
};

export const CustomTable = ({ fields, filterData, api, params, uniqueId }: Params) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await apiHelperService.fetchData(api, params || {});
        setData(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="px-4">
      <div className="mb-8 mt-4">
        <Card>
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
                            value={elem[field.fieldName]}
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
