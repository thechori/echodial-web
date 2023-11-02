import { Box, Flex, Tooltip } from "@mantine/core";
import { PiPhone } from "react-icons/pi";
//
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setAlphaDialerVisible } from "../../store/dialer/slice";
import AlphaDialerFabStyled from "./AlphaDialerFab.styles";
import BetaDialer from "./BetaDialer";
import { AiOutlineClose } from "react-icons/ai";

const AlphaDialerFab = () => {
  const dispatch = useAppDispatch();

  const { alphaDialerVisible } = useAppSelector((state) => state.dialer);

  return (
    <AlphaDialerFabStyled>
      <BetaDialer />

      <Box id="fab">
        {alphaDialerVisible ? (
          <Tooltip label="Hide dialer" openDelay={500}>
            <Flex align="center" justify="center">
              <AiOutlineClose
                size={30}
                color="white"
                onClick={() => dispatch(setAlphaDialerVisible(false))}
              />
            </Flex>
          </Tooltip>
        ) : (
          <Tooltip label="Show dialer" openDelay={500}>
            <Flex align="center" justify="center">
              <PiPhone
                size={40}
                color="white"
                onClick={() => dispatch(setAlphaDialerVisible(true))}
              />
            </Flex>
          </Tooltip>
        )}
      </Box>
    </AlphaDialerFabStyled>
  );
};

export default AlphaDialerFab;
