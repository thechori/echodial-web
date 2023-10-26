import { Box, Tooltip } from "@mantine/core";
import { PiPhone, PiPhoneFill } from "react-icons/pi";
//
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setAlphaDialerVisible } from "../../store/dialer/slice";
import AlphaDialerFabStyled from "./AlphaDialerFab.styles";
import BetaDialer from "./BetaDialer";

const AlphaDialerFab = () => {
  const dispatch = useAppDispatch();

  const { alphaDialerVisible } = useAppSelector((state) => state.dialer);

  return (
    <AlphaDialerFabStyled>
      <BetaDialer />

      <Box id="fab">
        {alphaDialerVisible ? (
          <Tooltip label="Hide dialer" openDelay={500}>
            <div>
              <PiPhoneFill
                size={40}
                color="white"
                onClick={() => dispatch(setAlphaDialerVisible(false))}
              />
            </div>
          </Tooltip>
        ) : (
          <Tooltip label="Show dialer" openDelay={500}>
            <div>
              <PiPhone
                size={40}
                color="white"
                onClick={() => dispatch(setAlphaDialerVisible(true))}
              />
            </div>
          </Tooltip>
        )}
      </Box>
    </AlphaDialerFabStyled>
  );
};

export default AlphaDialerFab;
