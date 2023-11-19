import { Box, Flex, Tooltip } from "@mantine/core";
import { PiPhone } from "react-icons/pi";
import { AiOutlineClose } from "react-icons/ai";
//
import AlphaDialerFabStyled from "./AlphaDialerFab.styles";
import BetaDialer from "./BetaDialer";
import { dialerSignal } from "./Dialer.signal";
import { useAppSelector } from "../../store/hooks";

const AlphaDialerFab = () => {
  const { dialQueue } = useAppSelector((state) => state.dialer);
  return (
    <AlphaDialerFabStyled>
      <BetaDialer />

      {!!dialQueue.length && (
        <Box id="fab">
          {dialerSignal.visible ? (
            <Tooltip label="Hide dialer" openDelay={500}>
              <Flex align="center" justify="center">
                <AiOutlineClose
                  size={30}
                  color="white"
                  onClick={() => (dialerSignal.visible = false)}
                />
              </Flex>
            </Tooltip>
          ) : (
            <Tooltip label="Show dialer" openDelay={500}>
              <Flex align="center" justify="center">
                <PiPhone
                  size={40}
                  color="white"
                  onClick={() => (dialerSignal.visible = true)}
                />
              </Flex>
            </Tooltip>
          )}
        </Box>
      )}
    </AlphaDialerFabStyled>
  );
};

export default AlphaDialerFab;
