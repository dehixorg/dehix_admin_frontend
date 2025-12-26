import { CustomComponentProps } from "../custom-table/FieldTypes";
import { DomainDetail } from "./DomainDetail";

export const CustomTableComponent = ({
  id,
  data,
  refetch,
}: CustomComponentProps) => {
  return data && <DomainDetail id={id} data={data} refetch={refetch} />;
};
