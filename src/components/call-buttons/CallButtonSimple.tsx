import { PiPhoneDisconnect } from "react-icons/pi";
import { Flex } from "@mantine/core";
import { MdPhone } from "react-icons/md";
//
import CallButtonSimpleStyled from "./CallButtonSimple.styles";

export type TCallButtonSimpleProps = {
  active: boolean;
  onInactiveClick: () => void;
  onActiveClick: () => void;
  callCount?: number;
};

const CallButtonSimple = ({
  active,
  onInactiveClick,
  onActiveClick,
}: TCallButtonSimpleProps) => {
  if (active) {
    return (
      <CallButtonSimpleStyled $active={active}>
        <PiPhoneDisconnect
          color="red"
          fontSize="1.5rem"
          onClick={onActiveClick}
        />
      </CallButtonSimpleStyled>
    );
  }

  return (
    <CallButtonSimpleStyled $active={active}>
      <Flex align="center">
        <MdPhone color="green" fontSize="1.5rem" onClick={onInactiveClick} />
      </Flex>
    </CallButtonSimpleStyled>
  );
};

export default CallButtonSimple;
