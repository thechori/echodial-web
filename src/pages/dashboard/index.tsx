import { Box, Card, Container, Grid, Title } from "@mantine/core";
import DashboardStyled from "./Dashboard.styles";
import StatsGrid from "./StatsGrid";
import LineChartRechart from "./LineChartRechart";

function Dashboard() {
  return (
    <DashboardStyled>
      <Container p="lg">
        <Grid>
          <Grid.Col>
            <StatsGrid
              data={[
                {
                  title: "EARNINGS",
                  diff: 41,
                  icon: "discount",
                  value: "$23,198.27",
                },
                {
                  title: "CALLS SENT",
                  diff: -6,
                  icon: "phone",
                  value: "2,198",
                },
                {
                  title: "DEALS CLOSED",
                  diff: 23,
                  icon: "coin",
                  value: "$41,233.12",
                },
                {
                  title: "MINUTE REMAINING",
                  diff: -7,
                  icon: "clock",
                  value: "612",
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
