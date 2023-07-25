import { styled } from "styled-components";
import { useAppSelector } from "../../store/hooks";
import { Card, Title } from "@mantine/core";

const ActiveCallStyled = styled.div`
  .call {
    border: 1px solid lightgrey;
    padding: 1rem;
  }
`;

const ActiveCall = () => {
  const { activeContact } = useAppSelector((state) => state.dialer);

  return (
    <ActiveCallStyled>
      <Card withBorder radius="md" p="md">
        <Title order={2}>Active Call</Title>

        {activeContact ? (
          <div className="call">
            {activeContact.phone} ({activeContact.firstName}{" "}
            {activeContact.lastName})
          </div>
        ) : (
          <i>No active calls</i>
        )}
      </Card>
    </ActiveCallStyled>
  );
};

export default ActiveCall;
