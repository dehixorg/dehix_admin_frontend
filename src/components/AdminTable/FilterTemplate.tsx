import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { compose, space, layout, flexbox, position } from "styled-system";
import { H2 } from "@components/Heading";
import { useIntl } from "react-intl";
import { default as PRSidebar } from "@components/Sidebar";

import ActionTemplate from "./ActionTemplate";
import CustomAccordion from "./components/CustomAccordion";

const Sidebar = styled(PRSidebar)`
  ${compose(space, layout, flexbox, position)}
  display: block;
  overflow: auto;
`;

const FilterTemplate = (props) => {
  const {
    onApplyFilter,
    onCancelFilter,
    onHide,
    options,
    setOptions,
    onFilterSelectedData,
    showDialog,
  } = props;
  const { messages } = useIntl();

  const enableFilter = !!onFilterSelectedData(options)?.length;

  const handleApplyFilters = (e) => {
    const selectedData = onFilterSelectedData(options);
    if (onApplyFilter) {
      onApplyFilter(selectedData, options, e);
    }
    onHide();
  };

  const handleClearFilters = (e) => {
    const clearfilters = options?.map((obj) => {
      const { options: objOptions } = obj;
      obj.options = objOptions?.map((opt) => {
        if (obj.type !== "checkbox") {
          return { ...opt, value: "" };
        }
        return { ...opt, checked: false };
      });
      return obj;
    });
    setOptions(clearfilters);
    const selectedData = onFilterSelectedData(clearfilters);
    if (onCancelFilter) {
      onCancelFilter(selectedData, options, e);
    }
    onHide();
  };

  const handleOnClick = (value, id) => (e) => {
    const filterSelectedData = options.map((optValues) => {
      if (optValues.options) {
        optValues.options = optValues.options.map((obj) => {
          if (optValues.type !== "checkbox" && obj?.id === id) {
            if (optValues.type === value && value !== "calendar") {
              return { ...obj, value: e.target.value };
            }
            return { ...obj, value: e?.value };
          }
          if (obj.value === value && obj.id === id) {
            return { ...obj, checked: !obj.checked };
          }
          return obj;
        });
      }
      return optValues;
    });
    setOptions(filterSelectedData);
  };

  const filterButtons = [
    {
      id: "ok",
      type: "primary-button",
      label: messages.label_ok,
      width: "-webkit-fill-available",
      mt: 27,
      mb: 12,
      mx: 3,
      onClick: handleApplyFilters,
    },
    {
      type: "transparent-button",
      label: messages.label_clear_filters,
      icon: "trash",
      mb: 27,
      onClick: handleClearFilters,
      disabled: !enableFilter,
      width: "-webkit-fill-available",
    },
  ];

  const values = options?.map((value) => {
    const obj = value;
    obj.options = obj?.options?.map((val) => ({
      ...val,
      onClick: handleOnClick,
    }));
    return obj;
  });

  const filterContent = values.map((value) => (
    <CustomAccordion value={value} key={`value-${value}`} />
  ));

  const buttonContent = filterButtons.map((value) =>
    ActionTemplate(value.type, value),
  );

  const dialogContent = [...filterContent, ...buttonContent];

  return (
    <Sidebar
      header={<H2 textAlign="left">{messages.title_filter}</H2>}
      visible={showDialog}
      width={[1, 8 / 10, 8 / 10, "314px"]}
      onHide={onHide}
      draggable={false}
      position="right"
    >
      {dialogContent}
    </Sidebar>
  );
};

FilterTemplate.propTypes = {
  showDialog: PropTypes.bool,
  onHide: PropTypes.bool,
  onApplyFilter: PropTypes.func,
  onCancelFilter: PropTypes.func,
  options: PropTypes.array,
  setOptions: PropTypes.func,
  onFilterSelectedData: PropTypes.func,
};

export default FilterTemplate;
