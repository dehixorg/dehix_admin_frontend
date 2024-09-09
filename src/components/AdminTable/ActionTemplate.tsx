import React from "react";
import PropTypes from "prop-types";
import { default as Div } from "@/components/ui";
import styled from "styled-components";
import { PrimaryButton, ButtonRaisedIcon } from "@components/Button";
import Icon from "@components/Icon";
import Calendar from "@components/Calendar";
import Checkbox from "@components/Checkbox";
import Label from "@components/Label";
import MultiSelect from "@components/MultiSelect";
import { useIntl } from "react-intl";

import SearchBar from "./components/SearchBar";

const Button = styled(ButtonRaisedIcon)`
  background-color: inherit !important;
  box-shadow: none !important;
  padding: 8px;
  margin: 0;
  color: var(--grey-dark) !important;
  i {
    font-weight: var(--semibold-weight);
    color: var(--turquoise);
    cursor: pointer;
  }
  &:hover {
    i {
      color: var(--blue-dark);
    }
  }
`;
const TransparentButton = styled(Button)`
  color: var(--turquoise) !important;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
  .p-button-label {
    flex: none !important;
  }
  i {
    font-size: var(--fs-icon-l);
    &:hover {
      color: var(--turquoise);
    }
  }
`;

const ActionTemplate = (type, value) => {
  const { messages } = useIntl();
  const { isHidden = false } = value;
  const { id, label, icon, content, checked, onClick, options = [] } = value;

  if (!isHidden) {
    return (
      <>
        {(() => {
          switch (type) {
            case "button":
              return (
                <Button
                  {...value}
                  key={id}
                  id={id}
                  mx={2}
                  label={label}
                  icon={<Icon name={icon} pr={`${label ? 1 : 0}`} />}
                />
              );
            case "button-tooltip":
              return (
                <Button
                  {...value}
                  key={id}
                  id={id}
                  label={label}
                  icon={<Icon name={icon} pt={`${label ? "10px" : ""}`} />}
                  tooltip={content}
                  tooltipOptions={{ position: "bottom" }}
                  borderLeft={"1px solid var(--white) !important"}
                />
              );
            case "transparent-button":
              return (
                <TransparentButton
                  {...value}
                  semibold
                  icon={<Icon name={icon} mr={1} cursor="pointer" />}
                />
              );
            case "primary-button":
              return (
                <PrimaryButton
                  {...value}
                  icon={icon ? <Icon name={icon} mr={label ? 2 : 0} /> : ""}
                />
              );
            case "search":
              return <SearchBar {...value} />;
            case "calendar":
              return (
                <Calendar
                  key={`calendar-${id}-${label}`}
                  id={`calendar${id}`}
                  placeholder={label}
                  showIcon
                  icon={<Icon name="calendar" />}
                  value={value?.value}
                  onChange={value?.onClick(type, id)}
                  selectionMode={"range"}
                  readOnlyInput
                  hideOnRangeSelection
                  mr={[0, 3]}
                  mb={20}
                  width={1}
                  showButtonBar
                  dateFormat={messages.date_format}
                />
              );
            case "checkbox":
              return (
                <Div
                  alignItems="center"
                  display="flex"
                  key={`check-${label}`}
                  width={value?.width || [0.5, 0.5, 0.5, 0.43]}
                  mb={2}
                >
                  <Checkbox
                    key={id}
                    inputId={id}
                    checked={checked}
                    onChange={onClick(value?.value)}
                    {...value}
                    input
                  />
                  <Label
                    htmlFor={id}
                    className="p-checkbox-label"
                    fontSize="var(--fs-text-small) !important"
                    fontWeight="var(--medium-weight) !important"
                    mx={2}
                  >
                    {label}
                  </Label>
                </Div>
              );
            case "multiselect":
              return (
                <Div width={1}>
                  <MultiSelect
                    {...value}
                    type={type}
                    onChange={onClick(type, id)}
                    value={value?.value}
                    name={value?.name}
                    id={id}
                    key={id}
                    options={options}
                    optionLabel={"name"}
                    filter
                    inputId="multiselect"
                    width={"-webkit-fill-available"}
                  />
                </Div>
              );
          }
        })()}
      </>
    );
  }
  return <></>;
};

ActionTemplate.propTypes = {
  type: PropTypes.string,
};

export default ActionTemplate;
