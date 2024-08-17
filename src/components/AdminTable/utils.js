import Papa from "papaparse";
import { saveAs } from "file-saver";
import { onFilterSelectedData } from "@utils/utils";

export const formatCsvData = (formattedCsvData = []) => {
  const formattedData = formattedCsvData?.map((obj) => {
    const item = {};
    const { csvFormat = {} } = obj;
    Object.entries(csvFormat).map((x) => {
      const key = x[0]?.toString();
      const value = x[1]?.toString();
      item[key] = value;
      return x;
    });
    return item;
  });
  return formattedData;
};

export const triggerCsvDownload = (data, fileName = "") => {
  const csv = Papa.unparse(formatCsvData(data));
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, `${fileName}.csv`);
};

export const parseFilters = (filters, filterParams) => {
  const newFilters = filters.map((opt) => {
    const { id, options, type } = opt;

    if (filterParams[id] || type === "calendar") {
      opt.options = options.map((x) => {
        const [startdateId = "", endDateId = ""] = x.id || [];

        if (type === "checkbox" && filterParams[id]) {
          const [values = []] = filterParams[id];
          return { ...x, checked: values.includes(x.value) };
        } else if (
          type === "calendar" &&
          (filterParams[startdateId] || filterParams[endDateId])
        ) {
          const [[startDate = ""] = []] = filterParams[startdateId] || [];
          const [[endDate = ""] = []] = filterParams[endDateId] || [];
          return { ...x, value: [new Date(startDate), new Date(endDate)] };
        } else if (type === "input" && filterParams[id]) {
          let [values = ""] = filterParams[id];
          return { ...x, value: values };
        } else if (type === "multiselect" && filterParams[id]) {
          let [values = ""] = filterParams[id];
          values = values.includes(",")
            ? values.split(",").map((o) => o)
            : [values];
          return { ...x, value: values };
        }

        return { ...x };
      });
    }
    return { ...opt };
  });

  let updatedFilters = newFilters?.map((o) => {
    if (o?.type === "multiselect") {
      const { options: opt = [] } = o;
      if (opt?.length) {
        const [{ value = [], options = [] }] = opt || [];

        const updatedValues = Array.isArray(value)
          ? value.map((x) => {
              if (!x.name) {
                const findValues = options.find(
                  (y) => x === y?.code || Number(x) === y?.code,
                );
                return { ...findValues };
              }
              return { ...x };
            })
          : value;

        const updatedOptions = [{ ...opt[0], value: updatedValues }];
        return { ...o, value: updatedValues, options: updatedOptions };
      }
    }
    return { ...o };
  });

  return {
    filters: updatedFilters,
    selectedFilters: onFilterSelectedData(updatedFilters),
  };
};
