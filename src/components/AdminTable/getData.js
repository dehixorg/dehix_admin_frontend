import Axios from "@app/api/axios";
import { parseFilterParams, flattenObject } from "@utils/utils";

const constructParamForQueryBuilder = (params, search_fields) => {
  const {
    rows = 10,
    page = 1,
    sortOrder = "desc",
    filters = {},
    sortField = null,
    search = null,
  } = params;
  let payload = `?page=${page}&per_page=${rows}`;
  if (sortField) {
    const sort = `${sortOrder === "desc" ? "-" : ""}`;
    payload = `${payload}&sort=${sort}${sortField}`;
  }
  let filterParams = "";
  let searchParam = "";
  if (filters && Object.keys(filters)?.length) {
    filterParams = `&${parseFilterParams(["filter", filters])}`;
  }
  if (search) {
    searchParam = `&filter[search][value]=${search}&filter[search][columns]=${search_fields.join(
      ",",
    )}`;
  }
  return `${payload}${filterParams}${searchParam}`;
};

const constructParamForBackendCustomised = () => {
  return "";
};

const transformData = (data) => {
  return data?.map((value) => {
    return flattenObject(value);
  });
};

const constructUrl = (params, search_fields) => {
  const {
    rows = 10,
    page = 1,
    sortOrder = "desc",
    filters = {},
    sortField = null,
    search = null,
    first,
  } = params;
  const sort = sortOrder === 1 || sortOrder === "desc" ? "desc" : "asc";
  let queryParams = [
    ["page", page],
    ["per_page", rows],
    ["orderBy", `${sortField},${sort}`],
  ];
  if (filters && Object.keys(filters)?.length) {
    queryParams.push(["filters", `${JSON.stringify(filters)}`]);
  }
  if (search) {
    queryParams.push(["search[value]", `${search}`]);
    queryParams.push(["search[columns]", `${search_fields.join(",")}`]);
  }
  queryParams.push(["first", first]);
  return `?${queryParams.map((obj) => obj.join("=")).join("&")}`;
};

const getNestedData = (nested_data_selector, params, response) => {
  const { status } = response;
  const { data: primaryData } = response.data;
  const data = primaryData?.[nested_data_selector];

  const total = data?.length ?? 0;
  const meta = { total };

  const { page, rows: pageSize } = params;
  const paginatedData = data?.slice((page - 1) * pageSize, page * pageSize);

  return { meta, status, data: transformData(paginatedData) };
};

const getData = (api, params, enable_query_builder) => {
  const { resource, search_fields, nested_data_selector = "" } = api;
  const constructedParams = enable_query_builder
    ? constructParamForQueryBuilder(params, search_fields)
    : constructParamForBackendCustomised();
  let additionalParams;

  if (api?.params?.length) {
    additionalParams = api.params
      .map((o) => {
        const [label, value] = o;
        return `${label}=${Array.isArray(value) ? value.join(",") : value}`;
      })
      .join("&");
  }

  return Axios.get(resource + `${constructedParams}&${additionalParams}`).then(
    (response) => {
      if (nested_data_selector) {
        return getNestedData(nested_data_selector, params, response);
      } else {
        const { status } = response;
        const { data, total } = response.data;
        const meta = { total };

        return {
          meta,
          status,
          data: transformData(data),
          urlParam: constructUrl(params, search_fields).toString(),
        };
      }
    },
  );
};

export default getData;
