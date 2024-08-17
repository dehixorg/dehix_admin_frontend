import React from "react";
import styled from "styled-components";
import Link from "@components/Link";
import Icon from "@components/Icon";
import { H5 } from "@components/Heading";
import Div from "../Div";
import { SVLANG } from "@utils/constant";

const StyledDiv = styled(Div)`
  i {
    transform: rotate(180deg);
  }
`;

const prevPageTemplate = (options) => {
  return (
    <Link
      onClick={options.onClick}
      disabled={options.disabled}
      className={options.className}
    >
      <StyledDiv display="flex" flexDirection="reverse" opacity={1} px={2}>
        <Icon name={"headerarrowright"} color={"var(--turquoise)"} />
      </StyledDiv>
    </Link>
  );
};

const nextPageTemplate = (options) => {
  return (
    <Link
      onClick={options.onClick}
      disabled={options.disabled}
      className={options.className}
    >
      <Div display="flex" flexDirection="reverse" opacity={1} px={2}>
        <Icon name={"headerarrowright"} color={"var(--turquoise)"} />
      </Div>
    </Link>
  );
};

const currentPageTemplate = (options) => {
  return (
    <H5>
      {options.first} - {options.last} {SVLANG.text_of} {options.totalRecords}
    </H5>
  );
};

export const paginatorTemplate = {
  layout: "PrevPageLink CurrentPageReport NextPageLink RowsPerPageDropdown ",

  PrevPageLink: (options) => {
    return prevPageTemplate(options);
  },
  CurrentPageReport: (options) => {
    return currentPageTemplate(options);
  },
  NextPageLink: (options) => {
    return nextPageTemplate(options);
  },
};

export default paginatorTemplate;
