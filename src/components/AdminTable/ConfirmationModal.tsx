import React from "react";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import Dialog from "@components/Dialog";
import { Text } from "@components/Text";
import { PrimaryButton } from "@components/Button";
import { H3 } from "@components/Heading";

import Div from "../Div";

const ConfirmationModal = ({ onClose, context, title }) => {
  const { messages } = useIntl();
  return (
    <Dialog
      header={<H3 textAlign="center">{title}</H3>}
      visible="displayBasic"
      width={[1, 1, 500, 500]}
      draggable={false}
      onHide={onClose}
      m={[3, 3, "auto", "auto"]}
    >
      <Div display="flex" alignItems="center" flexDirection="column">
        <Div my={3} textAlign="center">
          <Text>{context}</Text>
        </Div>
        <PrimaryButton
          rounded
          semibold
          label={messages.label_ok}
          onClick={onClose}
          mb={[4, 4, 4, 0]}
          width={[1, 1, 1, "45%"]}
        />
      </Div>
    </Dialog>
  );
};

ConfirmationModal.propTypes = {
  onClose: PropTypes.func,
  context: PropTypes.node,
  title: PropTypes.string,
};

export default ConfirmationModal;
