import { useEffect, useState } from "react";
import { styled } from "styled-components";
import apiService from "../../services/api";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { Card, Title } from "@mantine/core";
import {
  setActiveConferenceIds,
  setSelectedConferenceId,
} from "../../store/dialer/slice";

const ActiveConferencesStyled = styled.div`
  .call {
    border: 1px solid lightgrey;
    padding: 1rem;
  }
`;

const ActiveConferences = () => {
  const dispatch = useAppDispatch();
  const { activeConferenceIds, selectedConferenceId } = useAppSelector(
    (state) => state.dialer
  );
  const [activeConferencesidInterval, setactiveConferencesidInterval] =
    useState<any>(null);

  async function fetchActiveConferenceIds() {
    console.log("fetching active conference sids...");
    const { data } = await apiService.get("/conference/active-sids");
    dispatch(setActiveConferenceIds(data));
  }

  useEffect(() => {
    console.log("initializing activeConferences...");

    if (!activeConferencesidInterval) {
      const i = setInterval(fetchActiveConferenceIds, 2000);
      setactiveConferencesidInterval(i);
    }

    return () => {
      clearInterval(activeConferencesidInterval);
    };
  }, []);

  return (
    <ActiveConferencesStyled>
      <Card withBorder radius="md" p="md">
        <Title order={2}>Active Conferences</Title>
        <div className="conferences">
          {activeConferenceIds.length ? (
            activeConferenceIds.map((cid: string) => (
              <div
                key={cid}
                style={{
                  color: cid === selectedConferenceId ? "green" : "black",
                }}
                className="conference"
                onClick={() => dispatch(setSelectedConferenceId(cid))}
              >
                {cid}
              </div>
            ))
          ) : (
            <i>No active conferences</i>
          )}
        </div>
      </Card>
    </ActiveConferencesStyled>
  );
};

export default ActiveConferences;
