import { Box, Button, ScrollArea, Text, Title } from "@mantine/core";
import { IoMdPhoneLandscape } from "react-icons/io";
import { styled } from "styled-components";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import phoneFormatter from "../../utils/phone-formatter";
import devices from "../../styles/devices";
import { setAlphaDialerVisible } from "../../store/dialer/slice";

const AlphaDialerStyled = styled.div`
  .alphadialer {
    background-color: white;
    position: fixed;
    right: 0;
    bottom: 0;
    z-index: 100;
    border-left: 1px solid lightgrey;

    padding: 1rem;
    width: 100vw;
    height: 80%;
    box-shadow: -6px 4px 20px 0px #00000059;

    @media ${devices.tablet} {
      top: 0;
      box-shadow: -6px 4px 20px 0px #00000059;
      padding: 2rem;
      width: 50%;
    }

    @media ${devices.desktop} {
      width: 600px;
    }
  }
`;

// Super dialer that will allow you to navigate around the app WHILE dialing
// so that you can continue doing other things while you wait

function AlphaDialer() {
  const dispatch = useAppDispatch();

  const {
    // error,
    alphaDialerVisible,
    // device,
    // call,
    // status,
    // muted,
    // onHold,
    // token,
    // identity,
    // fromNumber,
    activeContact,
    contactQueue,
  } = useAppSelector((state) => state.dialer);

  const toggleAlphaDialer = () => {
    dispatch(setAlphaDialerVisible(!alphaDialerVisible));
  };

  return (
    <AlphaDialerStyled>
      {alphaDialerVisible && (
        <div className="alphadialer">
          <Box>
            <Title order={2}>AlphaDialer</Title>
          </Box>

          <Box>
            <Title order={3}>Active Call</Title>
            <Text>{phoneFormatter(activeContact?.phone)}</Text>
          </Box>
          <Box>
            <ScrollArea h="50%">
              {contactQueue.map((c) => (
                <div key={c.id}>{phoneFormatter(c.phone)}</div>
              ))}
            </ScrollArea>
          </Box>
        </div>
      )}

      <Box pos="fixed" right="16px" bottom="16px" style={{ zIndex: 101 }}>
        <Button onClick={toggleAlphaDialer}>
          <IoMdPhoneLandscape />
        </Button>
      </Box>
    </AlphaDialerStyled>
  );
}

export default AlphaDialer;
