import { Tooltip } from "@mantine/core";
import { PiPhone } from "react-icons/pi";
//
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setAlphaDialerVisible } from "../../store/dialer/slice";
import AlphaDialerFabStyled from "./AlphaDialerFab.styles";

const AlphaDialerFab = () => {
  const dispatch = useAppDispatch();

  const isVisible = useAppSelector((state) => state.dialer.alphaDialerVisible);

  console.log("hi");

  if (isVisible) return null;

  console.log("im here");

  return (
    <AlphaDialerFabStyled onClick={() => dispatch(setAlphaDialerVisible(true))}>
      <Tooltip label="Show call pane">
        <div>
          <PiPhone size={40} color="white" />
        </div>
      </Tooltip>
    </AlphaDialerFabStyled>
  );
};

export default AlphaDialerFab;
