import React, { useState } from "react";
import Proptypes from "prop-types";
import Div from "@components/Div";
import Icon from "@components/Icon";
import { TextUpperCase } from "@components/Text";

import ActionTemplate from "../ActionTemplate";

const CustomAccordion = ({ value }) => {
  const [expand, setExpand] = useState(true);

  const handleExpandAccordion = () => {
    setExpand(!expand);
  };

  return (
    <Div key={value.id} borderTop={"1px solid var(--turquoise-light)"}>
      <Div
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        onClick={handleExpandAccordion}
        cursor="pointer"
        p={3}
      >
        <TextUpperCase>{value.title}</TextUpperCase>
        <Icon
          name={expand ? "arrowbig-up" : "arrowbig-down"}
          fontSize="7px"
          onClick={handleExpandAccordion}
          cursor="pointer"
        />
      </Div>
      {expand && (
        <Div width={1} pb={3} px={3}>
          {value.options.map((obj) => {
            return ActionTemplate(value?.type, { ...obj, type: value?.type });
          })}
        </Div>
      )}
    </Div>
  );
};

CustomAccordion.propTypes = {
  value: Proptypes.object,
};

export default CustomAccordion;
