import { Tooltip } from "@mantine/core";
import { PiPhone, PiPhoneFill } from "react-icons/pi";
//
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setAlphaDialerVisible } from "../../store/dialer/slice";
import AlphaDialerFabStyled from "./AlphaDialerFab.styles";

const AlphaDialerFab = () => {
  const dispatch = useAppDispatch();

  const isVisible = useAppSelector((state) => state.dialer.alphaDialerVisible);

  return (
    <AlphaDialerFabStyled>
      {isVisible ? (
        <Tooltip label="Hide call pane">
          <div>
            <PiPhoneFill
              size={40}
              color="white"
              onClick={() => dispatch(setAlphaDialerVisible(false))}
            />
          </div>
        </Tooltip>
      ) : (
        <Tooltip label="Show call pane">
          <div>
            <PiPhone
              size={40}
              color="white"
              onClick={() => dispatch(setAlphaDialerVisible(true))}
            />
          </div>
        </Tooltip>
      )}
    </AlphaDialerFabStyled>
  );
};

export default AlphaDialerFab;
