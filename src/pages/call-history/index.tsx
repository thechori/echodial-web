import { Card, Container, Flex, Grid, Title } from "@mantine/core";
//
import CallHistory from "../dialer/CallHistory";

function CallHistoryPage() {
  console.log("call history");
  return (
    <Container fluid py="md">
      <Flex justify={"space-between"} align={"flex-start"} mb="md">
        <Title order={2}>Dialer</Title>
      </Flex>

      <Grid>
        <Grid.Col xs={12}>
          <Card withBorder shadow="md">
            <CallHistory />
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
}

export default CallHistoryPage;
