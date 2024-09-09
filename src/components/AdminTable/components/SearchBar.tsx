import React, { useState } from "react";
import { useIntl } from "react-intl";
import Proptypes from "prop-types";
import styled from "styled-components";
import Div from "@components/Div";
import { default as StyledInputText } from "@components/StyledInputText";
import Icon from "@components/Icon";

const InputText = styled(StyledInputText)`
  padding-left: 2rem;
  &:enabled {
    &:focus {
      box-shadow: none;
      border-color: none;
    }
    &:hover {
      border-color: none;
      box-shadow: none;
    }
  }
`;

const StyledIcon = styled.i`
  top: auto;
  fontsize: var(--fs-icon-m);
  cursor: pointer;
`;

const SearchBar = (props) => {
  const { messages } = useIntl();
  const { value, onChange, onSearch, onClear } = props;
  const [search, setSearch] = useState(value);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      onSearch(search);
    }
  };

  const handleChange = (event) => {
    setSearch(event.target.value);
    onChange(event);
  };

  const handleClear = () => {
    setSearch("");
    onClear();
  };

  return (
    <Div
      className="p-input-icon-right"
      ml={3}
      display="flex"
      alignItems="center"
      maxWidth={["180px", "100%", "100%", "100%"]}
      width={1}
    >
      <Icon
        name="search"
        className="pi pi-search"
        top="auto"
        ml={2}
        fontSize="var(--fs-icon-m)"
        color="var(--turquoise) !important"
      />
      <InputText
        width={1}
        height="36px"
        placeholder={messages.search_text}
        value={search}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
      />
      {search ? (
        <StyledIcon className="pi pi-times" onClick={handleClear} />
      ) : (
        <Icon name="close" display="none" />
      )}
    </Div>
  );
};

SearchBar.propTypes = {
  value: Proptypes.string,
  onChange: Proptypes.func,
  onSearch: Proptypes.func,
  onClear: Proptypes.func,
};

export default SearchBar;
