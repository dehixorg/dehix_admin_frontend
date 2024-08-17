import React, { memo } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link as RouterLink } from "react-router-dom";

import styled from "styled-components";

import Calendar from "@components/Calendar";
import Dropdown from "@components/Dropdown";
import {
  default as PRIcon,
  SmallEllipseIcon,
  RoundedRectIcon,
} from "@components/Icon";
import { TextMediumWeight } from "@components/Text";
import Tooltip from "@components/ToolTip";
import Span from "@components/Span";
import InputText from "@components/StyledInputText";

import { formatDateAndTime, getFormattedNumber } from "@utils/utils";

import MenuButton from "../Table/Utils/MenuButton";

const Icon = styled(PRIcon)`
  color: var(--turquoise);
  &:hover {
    color: var(--blue-dark);
  }
`;

const Link = styled(RouterLink)`
  text-decoration: none;
  color: var(--blue-medium);
`;

const DateAndTimeTemplate = (values, e) => {
  const { messages } = useIntl();
  const createdAt = formatDateAndTime(values[e.field]);
  const [date, time] = createdAt.split(",");
  return (
    <span title={`${date}, ${time}`}>
      <TextMediumWeight>
        {date} {messages.date_time_at}
      </TextMediumWeight>

      <TextMediumWeight color="var(--grey)!important">{time}</TextMediumWeight>
    </span>
  );
};

const dateTemplate = (values, e) => {
  const createdAt = formatDateAndTime(values[e.field]);
  const [date] = createdAt.split(",");
  return (
    <span title={`${date}`}>
      <TextMediumWeight>{date}</TextMediumWeight>{" "}
    </span>
  );
};

const BundleIcon = memo(
  <Span
    p={"3px 6px"}
    ml={2}
    bg="var(--blue-dark)"
    color="var(--white) !important"
    borderRadius="5px"
    bold
  >
    P
  </Span>,
);

const serviceNameTemplate = (values, e) => {
  const { column: { props: { formatter } = {} } = {} } = e;
  const value = formatter ? formatter(values[e.field]) : values[e.field];
  return (
    <TextMediumWeight>
      {value || "-"}
      {values["service_type"] === "bundle" ? BundleIcon : ""}
      {values.description ? (
        <SmallEllipseIcon ml={2} className={`class-${values?.id}`} name="info">
          <Tooltip
            target={`.class-${values?.id}`}
            content={values["description"]}
          />
        </SmallEllipseIcon>
      ) : (
        ""
      )}
    </TextMediumWeight>
  );
};

const enumTemplate = (values, e) => {
  const { column: { props: { formatter } = {} } = {} } = e;
  const value = values?.[e.field]?.toString() ?? "";
  const formattedStatus = formatter ? formatter(values[e.field]) : "";
  const translatedStatus = value ? (
    <FormattedMessage
      id={`${value?.replaceAll("-", "_")}`}
      defaultMessage="-"
    />
  ) : (
    ""
  );
  const status = formattedStatus || translatedStatus || "-";

  return (
    <TextMediumWeight
      title={value || "-"}
      className={`${value?.toString()?.toLowerCase()}`}
    >
      {status}
    </TextMediumWeight>
  );
};

const generalTemplate = (values, e) => {
  const { column: { props: { className = "", formatter } = {} } = {} } = e;
  let value = values[e.field];
  if (typeof value === "string") {
    value = value.trim();
    if (value === "") {
      value = "-";
    }
  }
  return (
    <TextMediumWeight
      title={value?.toString() || "-"}
      className={className || `${value?.toString()?.toLowerCase()}`}
    >
      {formatter ? formatter(value, values) : value}
    </TextMediumWeight>
  );
};

const renderLink = (values, primaryAction) => (
  <Link to={primaryAction.href(values)}>
    <Icon
      name="headerarrowright"
      color="var(--turquoise)"
      cursor="pointer"
      href={(e) => primaryAction?.onClick(values, e)}
    />
  </Link>
);

const renderArrow = (values, primaryAction) =>
  (primaryAction?.showWhen === undefined ||
    primaryAction?.showWhen(values)) && (
    <Link to={primaryAction.href(values)}>
      <Icon
        name="headerarrowright"
        color="var(--turquoise)"
        cursor="pointer"
        onClick={(e) => primaryAction?.onClick(values, e)}
      />
    </Link>
  );

const renderLinkArrow = (values, primaryAction) =>
  primaryAction?.type === "link"
    ? renderLink(values, primaryAction)
    : renderArrow(values, primaryAction);

const arrowActionTemplate = (values, e) => {
  const { column: { props: { actions = [] } = {} } = {} } = e;
  const [primaryAction = {}] = actions;
  return actions?.length > 1 ? (
    <MenuButton
      type={{
        icon: "more-vertical",
        items: actions
          ?.filter((action) => !action?.shouldHideAction?.(values))
          ?.map((o) => {
            const { type, href, formatter } = o;

            if (type === "link") {
              return {
                ...o,
                label: formatter ? formatter(values) : o?.label,
                url: href(values),
              };
            }

            return {
              ...o,
              label: formatter ? formatter(values) : o?.label,
              icon: o?.iconSelector ? o?.iconSelector(values) : o?.icon,
              command: () => {
                o?.onClick(values);
              },
            };
          }),
        has_transparent_bg: true,
        iconSize: "var(--fs-icon-m)",
      }}
    />
  ) : (
    renderLinkArrow(values, primaryAction)
  );
};

const editableDropDownTemplate = ({ column, editorCallback, value, field }) => {
  const { props: { options, optionLabel, enableFilter, filterBy } = {} } =
    column ?? {};

  const handleChange = (e) => editorCallback(e.target.value);

  return (
    <Dropdown
      filter={enableFilter}
      filterBy={filterBy}
      placeholder={
        <FormattedMessage id="placeholder_choose" defaultMessage={"Choose"} />
      }
      value={value}
      name={field}
      options={options}
      optionLabel={optionLabel}
      onChange={handleChange}
      width={"-webkit-fill-available"}
      mb={0}
    />
  );
};

const editableInputTextTemplate = (options) => {
  const {
    value,
    field,
    column: { props: { placeholder = "" } = {} } = {},
  } = options;

  return (
    <InputText
      curved
      type="text"
      value={value}
      name={field}
      placeholder={placeholder}
      width={"-webkit-fill-available"}
      onChange={(e) => options.editorCallback(e.target.value)}
    />
  );
};

const editableDateTemplate = (options) => {
  const {
    value,
    field,
    rowIndex,
    column: { props: { placeholder = "" } = {} } = {},
  } = options;

  const handleDateChange = (event) => {
    const { value = "" } = event;
    options?.editorCallback?.(value);
  };

  return (
    <Calendar
      curved
      showIcon
      dateFormat="yy-mm-dd"
      width="-webkit-fill-available"
      name={`${field}_${rowIndex}`}
      placeholder={placeholder}
      value={value}
      onChange={handleDateChange}
    />
  );
};

const linkTemplate = (values, e) => {
  const {
    column: { props: { className = "", href = () => {}, formatter } = {} } = {},
    field,
  } = e;
  const value = values[field];
  const valueToRender = value || "-";

  return (
    <Link
      to={href(values)}
      className={className || `${value?.toString()?.toLowerCase()}`}
    >
      {formatter ? formatter(value, values) : valueToRender}
    </Link>
  );
};

const currencyTemplate = (values, e) => {
  const { column: { props: { className = "" } = {} } = {} } = e;
  const value = values[e.field];
  const formattedValue = value ? `${getFormattedNumber(value)} kr` : `0 kr`;
  return (
    <TextMediumWeight
      title={value?.toString() || "-"}
      className={className || `${value?.toString()?.toLowerCase()}`}
    >
      {formattedValue}
    </TextMediumWeight>
  );
};

const idTemplate = (values, e) => {
  const {
    column: {
      props: { className = "", href = () => {}, plainText = false } = {},
    } = {},
  } = e;
  const value = values[e.field];
  const formattedValue = value || "-";
  const textColor = plainText
    ? "var(--grey-dark) !important"
    : "var(--blue-medium) !important";
  const content = (
    <TextMediumWeight
      title={value?.toString() || "-"}
      className={className || `${value?.toString()?.toLowerCase()}`}
      color={textColor}
    >
      {formattedValue}
    </TextMediumWeight>
  );

  return href(values) ? (
    <Link
      to={href(values)}
      className={className || `${value?.toString()?.toLowerCase()}`}
    >
      {content}
    </Link>
  ) : (
    content
  );
};

const deleteTemplate = (values, event) => {
  const { column: { props: { command = () => {} } = {} } = {}, rowIndex } =
    event;

  const handleDelete = () => {
    command?.({ ...values, rowIndex });
  };

  return (
    <Icon
      name="trash"
      color="var(--turquoise)"
      cursor="pointer"
      fontSize="var(--fs-icon-m)"
      onClick={handleDelete}
    />
  );
};

const cancelTemplate = (values, event) => {
  const { column: { props: { command = () => {} } = {} } = {}, rowIndex } =
    event;

  const handleCancel = () => {
    command?.({ ...values, rowIndex });
  };

  return (
    <RoundedRectIcon>
      <Icon
        name="rubber"
        color="var(--turquoise)"
        cursor="pointer"
        fontSize="var(--fs-link-m)"
        onClick={handleCancel}
      />
    </RoundedRectIcon>
  );
};

export const bodyTemplate = {
  text: generalTemplate,
  dateTime: DateAndTimeTemplate,
  actions: arrowActionTemplate,
  service: serviceNameTemplate,
  enum: enumTemplate,
  dropdown: editableDropDownTemplate,
  input: editableInputTextTemplate,
  calendar: editableDateTemplate,
  link: linkTemplate,
  currency: currencyTemplate,
  id: idTemplate,
  date: dateTemplate,
  delete: deleteTemplate,
  cancel: cancelTemplate,
};

export default bodyTemplate;
