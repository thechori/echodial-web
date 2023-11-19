import { Box, Flex, Tooltip } from "@mantine/core";
import { PiPhone } from "react-icons/pi";
import { AiOutlineClose } from "react-icons/ai";
//
import AlphaDialerFabStyled from "./AlphaDialerFab.styles";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setIsDialerOpen } from "../../store/dialer/slice";

const AlphaDialerFab = () => {
  const dispatch = useAppDispatch();
  const { dialQueue, isDialerOpen } = useAppSelector((state) => state.dialer);
  return (
    <AlphaDialerFabStyled>
      {!!dialQueue.length && (
        <Box id="fab">
          {isDialerOpen ? (
            <Tooltip label="Hide dialer" openDelay={500}>
              <Flex align="center" justify="center">
                <AiOutlineClose
                  size={30}
                  color="white"
                  onClick={() => dispatch(setIsDialerOpen(false))}
                />
              </Flex>
            </Tooltip>
          ) : (
            <Tooltip label="Show dialer" openDelay={500}>
              <Flex align="center" justify="center">
                <PiPhone
                  size={40}
                  color="white"
                  onClick={() => dispatch(setIsDialerOpen(true))}
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
