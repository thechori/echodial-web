import { styled } from "styled-components";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { Box, Title } from "@mantine/core";
import IPhoneDial from "./IPhoneDial";
import {
  selectIsCallActive,
  setMuted,
  setOnHold,
} from "../../store/dialer/slice";

const ActiveCallStyled = styled.div`
  .call {
    /* border: 1px solid lightgrey; */
    padding: 1rem;
  }
`;

const ActiveCall = () => {
  const dispatch = useAppDispatch();
  const { activeContact, onHold, status, muted } = useAppSelector(
    (state) => state.dialer
  );
  const isCallActive = useAppSelector(selectIsCallActive);

  return (
    <ActiveCallStyled>
      <Title order={2} mb={16}>
        Active Call
      </Title>

      <Box>
        <IPhoneDial
          onHold={onHold}
          status={status}
          muted={muted}
          number={activeContact?.phone}
          setMuted={(muted) => dispatch(setMuted(muted))}
          setOnHold={(onHold) => dispatch(setOnHold(onHold))}
          isCallActive={isCallActive}
          start={() => alert("hi")}
          end={() => alert("hi")}
        />
      </Box>
    </ActiveCallStyled>
  );
};

export default ActiveCall;
