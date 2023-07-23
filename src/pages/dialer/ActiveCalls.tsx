import { useEffect, useState } from "react";
import { styled } from "styled-components";
import apiService from "../../services/api";

const ActiveCallsStyled = styled.div`
  border: 1px solid lightyellow;
`;

const ActiveCalls = () => {
  const [activeCallSidInterval, setActiveCallSidInterval] = useState<any>(null);
  const [activeCallSids, setActiveCallSids] = useState([]);

  async function fetchActiveCallSids() {
    console.log("fetching active call sids...");
    const { data } = await apiService.get("/dialer/active-call-sids");
    setActiveCallSids(data);
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
    <ActiveCallsStyled>
      <div className="title">Active Calls</div>
      <div className="ids">
        {activeCallSids.length ? (
          activeCallSids.map((id) => <div key={id}>{id}</div>)
        ) : (
          <div>No active calls</div>
        )}
      </div>
    </ActiveCallsStyled>
  );
};

export default ActiveCalls;
