import { Box, Card, Container, Grid, Title } from "@mantine/core";
import DashboardStyled from "./Dashboard.styles";
import StatsGrid from "./StatsGrid";
import LineChartRechart from "./LineChartRechart";
import { useGetDashboardMetricsQuery } from "../../services/metric";
import { useAppSelector } from "../../store/hooks";
import { selectMetricResolution } from "../../store/metric/slice";

function Dashboard() {
  const metricResolution = useAppSelector(selectMetricResolution);
  const { data, isLoading, error } =
    useGetDashboardMetricsQuery(metricResolution);

  return (
    <DashboardStyled>
      <Container fluid py="lg">
        <Grid>
          <Grid.Col>
            <StatsGrid
              metricResolution={metricResolution}
              error={error}
              data={[
                {
                  title: "Leads today",
                  diff: 0,
                  icon: "user",
                  value: isLoading
                    ? "..."
                    : data && data.leadsCreatedToday !== null
                    ? data.leadsCreatedToday
                    : "",
                },
                {
                  title: "CALLS MADE",
                  diff: 0,
                  icon: "phone",
                  value: isLoading
                    ? "..."
                    : data && data.callsMadeToday !== null
                    ? data.callsMadeToday
                    : "",
                },
                {
                  title: "CALLS ANSWERED",
                  diff: 0,
                  icon: "phone",
                  value: isLoading
                    ? "..."
                    : data && data.callsAnsweredToday !== null
                    ? data.callsAnsweredToday
                    : "",
                },
                {
                  title: "AVERAGE CALL DURATION",
                  diff: 0,
                  icon: "clock",
                  value: isLoading
                    ? "..."
                    : data && data.averageCallDurationToday !== null
                    ? data.averageCallDurationToday
                    : "",
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
