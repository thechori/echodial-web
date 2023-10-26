import { PiPhoneFill, PiPhoneDisconnect } from "react-icons/pi";
import CallButtonSimpleStyled from "./CallButtonSimple.styles";
import { Tooltip } from "@mantine/core";

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
  if (!active) {
    return (
      <CallButtonSimpleStyled>
        <Tooltip label="Call lead" openDelay={500}>
          <div>
            <PiPhoneDisconnect
              color="red"
              fontSize="1.5rem"
              onClick={onInactiveClick}
            />
          </div>
        </Tooltip>
      </CallButtonSimpleStyled>
    );
  }

  return (
    <CallButtonSimpleStyled>
      <Tooltip label="Call lead" openDelay={500}>
        <div>
          <PiPhoneFill
            color="green"
            fontSize="1.5rem"
            onClick={onActiveClick}
          />
        </div>
      </Tooltip>
    </CallButtonSimpleStyled>
  );
};

export default CallButtonSimple;
