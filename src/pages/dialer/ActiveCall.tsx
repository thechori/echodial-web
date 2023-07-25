import { styled } from "styled-components";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { Box, Card, Title } from "@mantine/core";
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
      <Card withBorder radius="md" p="md">
        <Title order={2}>Active Call</Title>

        <Box p="md">
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
      </Card>
    </ActiveCallStyled>
  );
};

export default ActiveCall;
