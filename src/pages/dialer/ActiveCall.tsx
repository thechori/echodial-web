import { styled } from "styled-components";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { Box, Button, Text, Title } from "@mantine/core";
import { setAlphaDialerVisible } from "../../store/dialer/slice";
import phoneFormatter from "../../utils/phone-formatter";
import AlphaDialer from "./AlphaDialer";

const ActiveCallStyled = styled.div`
  .call {
    padding: 1rem;
  }
`;

const ActiveCall = () => {
  const dispatch = useAppDispatch();
  const { activeContact, status } = useAppSelector((state) => state.dialer);

  const showAlphaDialer = () => {
    dispatch(setAlphaDialerVisible(true));
  };

  return (
    <ActiveCallStyled>
      <Title order={2}>Active Call</Title>

      <Box py="md">
        <Text>Status: {status}</Text>
        <Text>Phone number: {phoneFormatter(activeContact?.phone)}</Text>
      </Box>

      <Box>
        <Button onClick={showAlphaDialer}>Open AlphaDialer</Button>
      </Box>

      <AlphaDialer />
    </ActiveCallStyled>
  );
};

export default ActiveCall;
