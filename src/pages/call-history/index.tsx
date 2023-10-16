import { Card, Container, Grid } from "@mantine/core";
//
import CallHistory from "../dialer/CallHistory";

function CallHistoryPage() {
  console.log("call history");
  return (
    <Container fluid>
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
