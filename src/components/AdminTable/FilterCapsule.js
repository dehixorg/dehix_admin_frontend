import React from "react";
import styled from "styled-components";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import Div from "@components/Div";
import CloseIcon from "@assets/close-icon.svg";
import Link from "@components/Link";
import { Text, TextMediumWeight } from "@components/Text";
import Logo from "../Logo";

const StyledLink = styled(Link)`
  text-decoration: underline;
  color: var(--grey);
  font-weight: var(--medium-weight);
  cursor: pointer;
  white-space: nowrap;
`;

export const FilterCapsule = ({
  onClear,
  onClick,
  filters,
  appliedFilters,
}) => {
  const { messages } = useIntl();

  const getFilterCapsule = (datelabel, title, label, key, onClick) => (
    <Div
      display="flex"
      alignItems="center"
      bg="var(--white)"
      p={"4px 8px"}
      borderRadius={"5px"}
      key={key}
      mr={14}
      mb={1}
      onClick={onClick}
    >
      <Logo width={9} height={9} mr={10} logo={CloseIcon} />
      <Text
        color="var(--light-gray) !important"
        fontWeight="var(--light-weight) !important"
        fontSize={"var(--fs-text-small) !important"}
        lineHeight={"var(--fs-text-small) !important"}
      >
        {datelabel || title}:
      </Text>
      <TextMediumWeight
        ml={1}
        lineHeight={"var(--fs-text-small) !important"}
        fontSize={"var(--fs-text-small) !important"}
      >
        {label}
      </TextMediumWeight>
    </Div>
  );

  const filterSelectedValues = (values = [], data = {}) => {
    const {
      title = "",
      options = [],
      type = "",
      id: filterColumnId = "",
    } = data;
    if (type === "calendar") {
      const [fromdate = {}, todate = {}] = values;
      const [start_date = ""] = fromdate.values || [];
      let label_date = start_date;
      const [end_date = ""] = todate.values || [];

      if (end_date) {
        label_date = `${label_date} - ${end_date}`;
      } else {
        label_date = `${label_date} - ${start_date}`;
      }

      return getFilterCapsule(
        messages.label_date,
        title,
        label_date,
        `filter-date-`,
        onClick(values, type, "calendar", ""),
      );
    } else if (type === "checkbox") {
      const filterItems = options.filter((o) => values?.includes(o?.value));
      const label = filterItems.map((o) => o.label).join(", ");
      return getFilterCapsule(
        "",
        title,
        label,
        `filter-${filterColumnId}-`,
        onClick(values, type, filterColumnId),
      );
    }
    return values?.map((value) => {
      let {
        label = "",
        id = "",
        options: multiselectOptions = [],
      } = options.find((opt) => opt.value === value) || {};
      let datelabel = "",
        optionId = "";
      if (type === "input") {
        label = value;
      }
      if (type === "multiselect") {
        const filterValues = Array.isArray(value)
          ? value?.map((o) => o?.code || o)
          : [value];
        const finalValues = multiselectOptions?.filter(
          (obj) =>
            filterValues.includes(obj?.code) ||
            filterValues.includes(String(obj?.code)),
        );
        label = finalValues?.map((o) => o?.name).join(",");
        optionId = value;
      }
      return getFilterCapsule(
        datelabel,
        title,
        label,
        `filter-${id}-${optionId}`,
        onClick(value, type, id, optionId),
      );
    });
  };

  const renderFiterCapules = () => {
    const calendarValue = appliedFilters.filter((o) => {
      const { values, type } = o;
      if (type === "calendar") {
        const [value = ""] = values;
        return value;
      }
      return "";
    });
    const otherFilters = appliedFilters.filter((o) => o.type !== "calendar");
    let selectedFilters = [...otherFilters];

    if (calendarValue?.length) {
      selectedFilters = [
        ...selectedFilters,
        {
          type: "calendar",
          values: calendarValue,
          id: "calendar",
        },
      ];
    }

    return selectedFilters?.map((obj) => {
      const { id, values, type } = obj;
      const data = filters.find(
        (filter) => filter.id === id || filter.id === type,
      );
      return filterSelectedValues(values, data);
    });
  };

  return (
    <>
      <Div
        display="flex"
        alignItems="center"
        flexWrap="wrap"
        justifyContent="right"
      >
        {renderFiterCapules()}
      </Div>
      <StyledLink
        fontSize={"var(--fs-text-small) !important"}
        lineHeight={"var(--fs-text-small) !important"}
        onClick={onClear}
        pr={2}
      >
        {messages.label_clear_filters}
      </StyledLink>
    </>
  );
};

FilterCapsule.propTypes = {
  filters: PropTypes.object,
  onClear: PropTypes.func,
  appliedFilters: PropTypes.array,
  onClick: PropTypes.func,
};

export default FilterCapsule;
