import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import ProgressSpinner from "@components/ProgressSpinner";
import { default as Div } from "@components/Div";
import ActionTemplate from "./ActionTemplate";
import { onFilterSelectedData } from "@utils/utils";
import FilterTemplate from "./FilterTemplate";
import FilterCapsule from "./FilterCapsule";

export const HeaderFilterTemplate = (props) => {
  const {
    filters,
    headerActions,
    searchAction,
    dataTableActions,
    onApplyFilter,
    onCancelFilter,
    appliedFilters,
    enable_csv_download = false,
    isCsvFileDownloading,
  } = props;
  const { messages } = useIntl();
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  let [options, setOptions] = useState(filters);

  useEffect(() => {
    setOptions(filters);
  }, [filters]);

  const handleOnClick = () => {
    setShowFilterPopup(!showFilterPopup);
  };

  const handleClearAllFilters = (e) => {
    const clearfilters = options.map((obj) => {
      const { options: objOptions } = obj;
      obj.options = objOptions.map((opt) => {
        if (obj.type !== "checkbox") {
          return { ...opt, value: "" };
        }
        return { ...opt, checked: false };
      });
      return obj;
    });
    setOptions(clearfilters);
    const selectedData = onFilterSelectedData(options);
    onApplyFilter(selectedData, clearfilters, e);
  };

  const searchTemplate = (searchAction) => {
    return (
      <Div
        display="flex"
        bg="var(--turquoise-light)"
        justifyContent="space-between"
        py={"14px"}
        flexWrap={["wrap", "wrap", "nowrap", "nowrap"]}
        alignItems="center"
        border="1px solid var(--grey-lightest)"
        borderBottom="1px solid var(--white)"
        height="60px"
        borderRadius="10px 10px 0px 0px"
      >
        <Div>
          {searchAction &&
            ActionTemplate("search", {
              ...searchAction,
            })}
        </Div>
        <Div display="flex" alignItems="center">
          {!!appliedFilters?.length && (
            <FilterCapsule
              appliedFilters={appliedFilters}
              filters={filters}
              onClear={handleClearAllFilters}
              onClick={handleOnFilterCapsuleClick}
            />
          )}
          {dataTableActions.map((obj) =>
            ActionTemplate(obj.type, {
              ...obj,
              onClick: handleOnClick,
            }),
          )}
          {enable_csv_download &&
            (isCsvFileDownloading ? (
              <ProgressSpinner aria-label="Loading" />
            ) : (
              ActionTemplate("button-tooltip", {
                id: "download",
                type: "button-tooltip",
                icon: "download-file",
                variant: "header",
                height: 40,
                px: 3,
                py: 20,
                onClick: props.onDownload,
                content: messages.order_download_description,
              })
            ))}
        </Div>
      </Div>
    );
  };

  const filterOption = (type, id, optionId, obj, value, optValues) => {
    if (type === "calendar") {
      return { ...obj, value: "" };
    }
    if (type === "input" && obj.id === id) {
      return { ...obj, value: "" };
    }
    if (type === "multiselect" && obj.id === id && optionId) {
      return { ...obj, value: "" };
    }
    if (
      value?.includes(obj?.value) &&
      type === "checkbox" &&
      id === optValues.id
    ) {
      return { ...obj, checked: !obj.checked };
    }
    return obj;
  };

  const handleOnFilterCapsuleClick = (value, type, id, optionId) => (e) => {
    const filterSelectedData = options?.map((optValues) => {
      if (optValues.options)
        optValues.options = optValues.options?.map((obj) => {
          return filterOption(type, id, optionId, obj, value, optValues);
        });
      return optValues;
    });
    setOptions(filterSelectedData);
    const selectedData = onFilterSelectedData(options);
    onApplyFilter(selectedData, filterSelectedData, e);
  };

  const filterTemplateProps = {
    filters,
    onApplyFilter,
    onCancelFilter,
    options,
    setOptions,
    handleOnFilterCapsuleClick,
    onFilterSelectedData,
  };

  const headerComponent = (children) => (
    <>
      <FilterTemplate
        {...filterTemplateProps}
        showDialog={showFilterPopup}
        onHide={handleOnClick}
      />
      <Div
        className="table-header"
        flexDirection={["column", "column", "row", "row"]}
      >
        <Div
          display="flex"
          alignItems={"center"}
          width={[1, 1, "auto", "auto"]}
          mb={[3, 3, 0, 0]}
        >
          {children}
        </Div>
      </Div>
      {searchTemplate(searchAction)}
    </>
  );
  const headerEl = headerActions?.map((value) => {
    if (value.id === "menu-button") {
      return ActionTemplate(value.type, { ...value });
    }
    return ActionTemplate(value.type, value);
  });
  return headerComponent(headerEl);
};
