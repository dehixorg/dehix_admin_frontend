import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useLocation, useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import { FilterMatchMode } from "primereact/api";
import { Column } from "primereact/column";
import { DataTable as PRDataTable } from "primereact/datatable";
import { Skeleton } from "primereact/skeleton";
import styled from "styled-components";
import { space, layout, flexbox, position } from "styled-system";
import Div from "@components/Div";
import Dropdown from "@components/Dropdown";
import Icon from "@components/Icon";

import { bodyTemplate } from "./BodyTemplate";
import ConfirmationModal from "./ConfirmationModal";
import { HeaderFilterTemplate } from "./HeaderTemplate";
import getData from "./getData";
import { paginatorTemplate } from "./PaginatorTemplate";
import { parseFilters } from "./utils";

const StyledDataTable = styled(PRDataTable)(space, layout, flexbox, position);

const DataTable = ({ config, resetData, dataTableRef }) => {
  const { messages } = useIntl();
  const { search } = useLocation();
  const urlParams = new URLSearchParams(search);
  const history = useHistory();

  const {
    columns,
    no_records_message = "no_results_found",
    emptyTemplate,
    row_edit,
    onRowEditComplete,
    onRowEditCancel,
    enable_row_selection = false,
    search_fields,
    default_sort: {
      field: defaultSortField = "created_at",
      order: defaultSortOrder = "desc",
    } = {},
    filters: filterOptions = [],
    header: {
      title = "",
      subTitle = "",
      actions = [],
      dataTableActions = [],
    } = {},
    enable_search = false,
    enable_csv_download = false,
    backend_querying = true,
    onFiltersApply = () => {},
    is_filter_options_updated = false,
  } = config;

  const [sort, sortOrder] = urlParams.get("orderBy")
    ? urlParams.get("orderBy").split(",")
    : [];

  const filtersApplied = urlParams.get("filters");

  const [params, setParams] = useState({
    rows: Number(urlParams.get("per_page")) || 20,
    page: Number(urlParams.get("page")) || 1,
    sortOrder: sortOrder || defaultSortOrder,
    sortField: sort || defaultSortField,
    first: Number(urlParams.get("first")) || 0,
    filters: filtersApplied ? JSON.parse(filtersApplied) : {},
    search: urlParams.get("search[value]") || "",
  });

  const [totalRecords, setTotalRecords] = useState(0);
  const [data, setData] = useState([]);
  const [customSearchFilters, setCustomSearchFilters] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCsvFileDownloading, setIsCsvFileDownloading] = useState(false);
  const [isCsvFileDownloaded, setIsCsvFileDownloaded] = useState(false);
  const [filters, setFilters] = useState(filterOptions);
  const [appliedFilters, setAppliedFilters] = useState(
    config?.defaultappliedFilters || [],
  );
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const { filters: newFilters, selectedFilters } = parseFilters(
      filters,
      params?.filters,
    );
    setFilters(newFilters);
    setAppliedFilters(selectedFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [is_filter_options_updated]);

  useEffect(() => {
    if (is_filter_options_updated) {
      const { filters: newFilters, selectedFilters } = parseFilters(
        filterOptions,
        params?.filters,
      );
      setFilters(newFilters);
      setAppliedFilters(selectedFilters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [is_filter_options_updated]);

  const handleFilters = (selectedFilters, options, event) => {
    const filterData = {};

    selectedFilters.map((obj) => {
      if (obj.id === "date") {
        filterData["start_date"] = [obj.values[0] ? obj.values[0] : ""];
        filterData["end_date"] = [obj.values[1] ? obj.values[1] : ""];
      } else if (obj.type === "multiselect") {
        filterData[obj.id] = [];
        const [filtervalue = []] = obj.values || [];
        filterData[obj.id].push(
          filtervalue?.map((o) => o?.code || "").join(","),
        );
      } else {
        filterData[obj.id] = [];
        filterData[obj.id].push(obj.values);
      }
      return obj;
    });
    onFiltersApply(selectedFilters);
    const _lazyParams = {
      ...params,
      ...event,
      filters: filterData,
    };
    setParams(_lazyParams);
    setFilters(options);
    setAppliedFilters(selectedFilters);
  };

  const headerActions = actions.map((o) => {
    const { label, onClick, isHidden, formatter, verifyBtnIsHidden } = o;
    return {
      ...o,
      onClick: (e) => {
        onClick(e, selectedCell);
        setSelectedCell(null);
      },
      label: formatter ? formatter(label, selectedCell) : label,
      isHidden: verifyBtnIsHidden ? verifyBtnIsHidden(selectedCell) : isHidden,
    };
  });

  let isLoading = false;

  useEffect(() => {
    const fetchData = async () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      isLoading = true;
      setLoading(true);
      const { api, enable_query_builder = false, static_data } = config;

      if (static_data) {
        const total = static_data?.length;

        setTotalRecords(total);
        setData(static_data);
        setLoading(false);
        isLoading = false;
        setIsInitialLoad(false);
      } else {
        try {
          const {
            data = [],
            meta: { total = "" } = {},
            urlParam = "",
          } = await getData(api, params, enable_query_builder);
          if (search !== urlParam) {
            history.push({
              pathname: history.location.pathname,
              search: urlParam,
            });
          }
          setTotalRecords(total);
          setData(data);
          setLoading(false);
          isLoading = false;
        } catch (e) {
          setLoading(false);
          isLoading = false;
        } finally {
          setIsInitialLoad(false);
        }
      }
    };

    if ((isInitialLoad || backend_querying || resetData) && !isLoading) {
      fetchData();
    }

    if (resetData) {
      setSelectedCell(null);
    }
  }, [config, params, resetData, backend_querying]);

  const handleOnDownloadCSV = async () => {
    setIsCsvFileDownloading(true);
    const {
      api,
      enable_query_builder = false,
      columns,
      csv_filename = `downloads.csv`,
    } = config;
    const { csvFields } = api;
    const { data = [] } = await getData(
      api,
      { ...params, page: 1, rows: totalRecords },
      enable_query_builder,
    );
    const csvData = data.map((row) => {
      if (!csvFields) {
        const csvObj = {};
        columns
          .filter((obj) => obj.db_field)
          .filter((obj) => !obj.isHidden)
          .forEach((column) => {
            const columnTitle = messages[column.title];
            csvObj[columnTitle] = column?.formatter
              ? column?.formatter(row[column.db_field], row)
              : row[column.db_field];
          });
        return csvObj;
      }
      const csvObj = {};
      Object.keys(csvFields).forEach((key) => {
        csvObj[key] = row[csvFields[key]];
      });
      return csvObj;
    });

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, csv_filename);
    setIsCsvFileDownloading(false);
    setIsCsvFileDownloaded(true);
  };

  const onSort = (event) => {
    let sortOrder = params.sortOrder === "desc" ? "asc" : "desc";

    if (!backend_querying) {
      sortOrder = params.sortOrder === -1 ? 1 : -1;
    }

    setParams({
      ...params,
      ...event,
      sortOrder: sortOrder,
      filters: params?.filters,
    });
  };

  const changeSearch = (value) => {
    setParams({
      ...params,
      search: value,
    });
    if (!backend_querying) {
      setCustomSearchFilters({
        global: { value, matchMode: FilterMatchMode.CONTAINS },
      });
    }
  };

  const handleSearch = (value) => {
    changeSearch(value);
  };

  const handleClearSearch = () => {
    changeSearch("");
  };

  const handleSearchChanged = (e) => {
    const {
      target: { value = "" },
    } = e;
    if (params?.search && value === "") {
      changeSearch("");
    }
  };

  const handleOnCellSelectionChange = (e) => {
    const { value } = e;
    setSelectedCell(value);
  };

  const headerTemplateProps = {
    title,
    subTitle,
    headerActions,
    backend_querying,
    dataTableActions,
    filters,
    appliedFilters,
    searchAction: enable_search
      ? {
          id: "search",
          type: "search",
          variant: "header",
          value: params?.search,
          onSearch: handleSearch,
          onChange: handleSearchChanged,
          onClear: handleClearSearch,
        }
      : enable_search,
    params,
    setParams,
    enable_csv_download,
    onApplyFilter: handleFilters,
    onCancelFilter: handleFilters,
    onDownload: handleOnDownloadCSV,
    isCsvFileDownloading,
  };

  const header = <HeaderFilterTemplate {...headerTemplateProps} />;

  const onPage = (event) => {
    const { page } = event;
    const { first, rows } = event;
    setParams({
      ...params,
      ...event,
      page: page + 1,
      first: first,
      rows: rows,
      filters: params?.filters,
    });
  };

  const onRowsChange = (event) => {
    setParams({
      ...params,
      ...event,
      rows: event?.value,
      page: 1,
      first: 0,
      filters: params?.filters,
    });
  };

  const rowsPerPageDropdown = (options) => {
    return (
      <Dropdown
        onChange={onRowsChange}
        value={options?.value}
        name="rows"
        optionLabel={"label"}
        options={options?.options}
        width={"auto"}
      />
    );
  };

  const paginator = {
    ...paginatorTemplate,
    RowsPerPageDropdown: rowsPerPageDropdown,
  };

  const handleCloseCsvPopup = () => {
    setIsCsvFileDownloaded(!isCsvFileDownloaded);
  };

  const skeletonLoader = [...Array(params?.rows)].map((o) => ({ id: o }));

  const reload = () => {
    const reloadData = async () => {
      const { api, enable_query_builder = false } = config;

      try {
        setLoading(true);

        const {
          data = [],
          meta: { total = "" } = {},
          urlParam = "",
        } = await getData(api, params, enable_query_builder);

        if (search !== urlParam) {
          history.push({
            pathname: history.location.pathname,
            search: urlParam,
          });
        }

        setTotalRecords(total);
        setData(data);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    reloadData();
  };

  const forwardRef = (ref) => {
    if (!dataTableRef) {
      return;
    }

    dataTableRef.current = { ...ref, reload };
  };

  return (
    <>
      {isCsvFileDownloaded && (
        <ConfirmationModal
          onClose={handleCloseCsvPopup}
          context={messages.message_download_csv}
          title={messages.download_csv}
        />
      )}
      <Div className="datatable-demo" pt={"16px"}>
        <StyledDataTable
          ref={forwardRef}
          value={loading ? skeletonLoader : data}
          header={header}
          className="p-datatable-custom"
          dataKey="id"
          rowHover
          paginator
          emptyMessage={emptyTemplate ?? messages[no_records_message]}
          paginatorTemplate={paginator}
          selectionMode={enable_row_selection ? "checkbox" : "multiple"}
          rows={params?.rows}
          rowsPerPageOptions={[20, 50, 100]}
          lazy={backend_querying}
          onPage={onPage}
          sortField={params.sortField}
          sortOrder={params.sortOrder}
          totalRecords={totalRecords}
          first={params.first}
          cellSelection
          selection={selectedCell}
          onSelectionChange={handleOnCellSelectionChange}
          onSort={onSort}
          sortIcon={<Icon name="sort" />}
          filters={customSearchFilters}
          globalFilterFields={search_fields}
          onRowEditComplete={onRowEditComplete}
          onRowEditCancel={onRowEditCancel}
          editMode="row"
        >
          {enable_row_selection && (
            <Column
              selectionMode="multiple"
              headerStyle={{ width: "52px" }}
              key={"id"}
            />
          )}
          {columns.map((value) => {
            const {
              db_field,
              title,
              editable,
              editable_mode,
              type,
              width,
              isHidden,
            } = value;
            return (
              !isHidden && (
                <Column
                  key={db_field}
                  field={db_field}
                  header={messages[title]}
                  editor={editable ? bodyTemplate[editable_mode] : false}
                  body={loading ? <Skeleton /> : bodyTemplate[type]}
                  column={{ header: title }}
                  style={{ width: width }}
                  {...value}
                />
              )
            );
          })}
          {row_edit && (
            <Column
              rowEditor={true}
              headerStyle={{ width: "15%", minWidth: "8rem" }}
              bodyStyle={{ textAlign: "center" }}
            />
          )}
        </StyledDataTable>
      </Div>
    </>
  );
};

DataTable.propTypes = {
  config: PropTypes.object,
  resetData: PropTypes.bool,
  dataTableRef: PropTypes.any,
};

export default DataTable;
