import { Box, Container, Grid } from "@mantine/core";
import DashboardStyled from "./Dashboard.styles";
import StatsGrid from "./StatsGrid";
import LineChart from "./LineChart";
import lineChartData from "./LineChart.data";

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
            <Box h={500}>
              <LineChart data={lineChartData} />
            </Box>
          </Grid.Col>
        </Grid>
      </Container>
    </DashboardStyled>
  );
}

export default Dashboard;
