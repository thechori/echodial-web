import { useEffect, useState } from "react";
import { styled } from "styled-components";
import apiService from "../../services/api";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { Card, Title } from "@mantine/core";
import { setActiveCallSids } from "../../store/dialer/slice";

const ActiveCallsStyled = styled.div`
  border: 1px solid lightyellow;
`;

const ActiveCalls = () => {
  const dispatch = useAppDispatch();
  const { activeCallSids, contactsActive } = useAppSelector(
    (state) => state.dialer
  );
  const [activeCallSidInterval, setActiveCallSidInterval] = useState<any>(null);

  async function fetchActiveCallSids() {
    console.log("fetching active call sids...");
    const { data } = await apiService.get("/dialer/active-call-sids");
    dispatch(setActiveCallSids(data));
  }

  useEffect(() => {
    console.log("initializing ActiveCalls...");

    if (!activeCallSidInterval) {
      const i = setInterval(fetchActiveCallSids, 2000);
      setActiveCallSidInterval(i);
    }

    return () => {
      clearInterval(activeCallSidInterval);
    };
  }, []);

  return (
    <Card withBorder radius="md" p="md">
      <Title order={2}>Active Calls</Title>
      <div className="contacts">
        {contactsActive.length ? (
          contactsActive.map((contact) => (
            <div key={contact.id}>
              {contact.phone} ({contact.firstName} {contact.lastName})
            </div>
          ))
        ) : (
          <div>No active contacts</div>
        )}
      </div>

      <div className="ids">
        {activeCallSids.length ? (
          activeCallSids.map((id) => <div key={id}>{id}</div>)
        ) : (
          <div>No active calls</div>
        )}
      </div>
    </Card>
  );
};

export default ActiveCalls;
