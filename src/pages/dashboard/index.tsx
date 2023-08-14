import { Box, Card, Container, Grid, Title } from "@mantine/core";
import DashboardStyled from "./Dashboard.styles";
import StatsGrid from "./StatsGrid";
import LineChartRechart from "./LineChartRechart";

function Dashboard() {
  return (
    <DashboardStyled>
      <Container fluid py="lg">
        <Grid>
          <Grid.Col>
            <StatsGrid
              data={[
                {
                  title: "Leads today",
                  diff: 0,
                  icon: "user",
                  value: "0",
                },
                {
                  title: "CALLS MADE",
                  diff: -6,
                  icon: "phone",
                  value: "2,198",
                },
                {
                  title: "CALLS ANSWERED",
                  diff: 23,
                  icon: "phone",
                  value: "1,032",
                },
                {
                  title: "AVERAGE CALL DURATION",
                  diff: -7,
                  icon: "clock",
                  value: "0:34",
                },
              ]}
            />
          </Grid.Col>

          <Grid.Col xs={12}>
            <Card withBorder shadow="md" py="md">
              <Title order={2} mb="md">
                Activity
              </Title>
              <Box h={400}>
                <LineChartRechart />
              </Box>
            </Card>
          </Grid.Col>
        </Grid>
      </Container>
    </DashboardStyled>
  );
}

export default Dashboard;
