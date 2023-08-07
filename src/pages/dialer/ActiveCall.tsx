import { styled } from "styled-components";
import { useAppSelector } from "../../store/hooks";
import { Box, Text, Title } from "@mantine/core";
import phoneFormatter from "../../utils/phone-formatter";

const ActiveCallStyled = styled.div`
  .call {
    padding: 1rem;
  }
`;

const ActiveCall = () => {
  // const dispatch = useAppDispatch();
  const { activeContact, status, error } = useAppSelector(
    (state) => state.dialer
  );

  // const showAlphaDialer = () => {
  //   dispatch(setAlphaDialerVisible(true));
  // };

  return (
    <ActiveCallStyled>
      <Title order={2}>Active Call</Title>

      <Box py="md">
        <Text>Status: {status}</Text>
        <Text>Phone number: {phoneFormatter(activeContact?.phone)}</Text>
        <Text color="red">{error}</Text>
      </Box>

      {/* <Box>
        <Button onClick={showAlphaDialer}>Open AlphaDialer</Button>
      </Box>

      <AlphaDialer /> */}
    </ActiveCallStyled>
  );
};

export default ActiveCall;
