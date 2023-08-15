import { Box, List, Text, Title } from "@mantine/core";
//
import { useGetCallsQuery } from "../../services/call";
import CallHistoryStyled from "./CallHistory.styles";
import { extractErrorMessage } from "../../utils/error";
import phoneFormatter from "../../utils/phone-formatter";

const CallHistory = () => {
  const { data: calls, error, isLoading } = useGetCallsQuery();

  return (
    <CallHistoryStyled>
      <Title order={2}>Call history</Title>

      <Box p="md">
        {isLoading ? (
          <Text>Loading...</Text>
        ) : error ? (
          <Text>{extractErrorMessage(error)}</Text>
        ) : calls && calls.length ? (
          <List p="md">
            {calls.map((c) => (
              <List.Item key={c.id}>
                Lead #{c.lead_id} .. From: {phoneFormatter(c.from_number)} ..
                To: {phoneFormatter(c.to_number)} (
                {new Date(c.created_at).toDateString()})
              </List.Item>
            ))}
          </List>
        ) : (
          <Text>No calls found</Text>
        )}
      </Box>
    </CallHistoryStyled>
  );
};

export default CallHistory;
