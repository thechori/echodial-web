import { Text } from "@mantine/core";
import { FaPhone, FaRegStopCircle } from "react-icons/fa";
import CallButtonWithCountStyled from "./CallButtonWithCount.styles";

export type TCallButtonWithCountProps = {
  callCount: number;
  active: boolean;
  onInactiveClick: () => void;
  onActiveClick: () => void;
};

const CallButtonWithCount = ({
  callCount,
  active,
  onInactiveClick,
  onActiveClick,
}: TCallButtonWithCountProps) => {
  if (!active) {
    return (
      <CallButtonWithCountStyled $active={active}>
        <FaRegStopCircle fontSize="1rem" onClick={onInactiveClick} />
        <Text className="call-count" size="xs">
          {callCount}
        </Text>
      </CallButtonWithCountStyled>
    );
  }

  return (
    <CallButtonWithCountStyled $active={active}>
      <FaPhone fontSize="1rem" onClick={onActiveClick} />
      <Text className="call-count" size="xs">
        {callCount}
      </Text>
    </CallButtonWithCountStyled>
  );
};

export default CallButtonWithCount;
