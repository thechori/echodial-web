import { Box, Card, Container, Flex, Grid, Select, Title } from "@mantine/core";
import DashboardStyled from "./Dashboard.styles";
import StatsGrid from "./StatsGrid";
import LineChartRechart from "./LineChartRechart";
import { useGetDashboardMetricsQuery } from "../../services/metric";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  selectMetricResolution,
  setMetricResolution,
} from "../../store/metric/slice";
import deltaPercentageCalculator from "../../utils/delta-percentage-calculator";

function Dashboard() {
  const dispatch = useAppDispatch();
  const metricResolution = useAppSelector(selectMetricResolution);
  const { data, isLoading, error } =
    useGetDashboardMetricsQuery(metricResolution);

  return (
    <DashboardStyled>
      <Container fluid py="md">
        <Grid>
          <Grid.Col>
            <Flex align="center">
              <Select
                w={120}
                data={[
                  {
                    value: "day",
                    label: "Day",
                  },
                  {
                    value: "week",
                    label: "Week",
                  },
                  {
                    value: "month",
                    label: "Month",
                  },
                ]}
                value={metricResolution}
                onChange={(value) => dispatch(setMetricResolution(value))}
              />
            </Flex>
          </Grid.Col>
          <Grid.Col>
            <StatsGrid
              metricResolution={metricResolution}
              error={error}
              data={[
                {
                  title:
                    metricResolution === "day"
                      ? "LEADS TODAY"
                      : metricResolution === "week"
                      ? "LEADS THIS WEEK"
                      : "LEADS THIS MONTH",
                  diff:
                    data &&
                    data.leadsCreatedCurrentPeriod &&
                    data.leadsCreatedPreviousPeriod
                      ? deltaPercentageCalculator(
                          parseInt(data.leadsCreatedPreviousPeriod),
                          parseInt(data.leadsCreatedCurrentPeriod)
                        )
                      : 0,
                  icon: "user",
                  value: isLoading
                    ? "..."
                    : data && data.leadsCreatedCurrentPeriod !== null
                    ? data.leadsCreatedCurrentPeriod
                    : "0",
                },
                {
                  title: "CALLS MADE",
                  diff:
                    data &&
                    data.callsMadeCurrentPeriod &&
                    data.callsMadePreviousPeriod
                      ? deltaPercentageCalculator(
                          parseInt(data.callsMadePreviousPeriod),
                          parseInt(data.callsMadeCurrentPeriod)
                        )
                      : 0,
                  icon: "phone",
                  value: isLoading
                    ? "..."
                    : data && data.callsMadeCurrentPeriod !== null
                    ? data.callsMadeCurrentPeriod
                    : "0",
                },
                {
                  title: "LEADS SOLD",
                  diff:
                    data &&
                    data.callsAnsweredCurrentPeriod &&
                    data.callsAnsweredPreviousPeriod
                      ? deltaPercentageCalculator(
                          parseInt(data.callsAnsweredPreviousPeriod),
                          parseInt(data.callsAnsweredCurrentPeriod)
                        )
                      : 0,
                  icon: "coin",
                  value: isLoading
                    ? "..."
                    : data && data.callsAnsweredCurrentPeriod !== null
                    ? data.callsAnsweredCurrentPeriod
                    : "0",
                },
                {
                  title: "AVERAGE CALL DURATION",
                  diff:
                    data &&
                    data.averageCallDurationCurrentPeriod &&
                    data.averageCallDurationPreviousPeriod
                      ? deltaPercentageCalculator(
                          parseInt(data.averageCallDurationPreviousPeriod),
                          parseInt(data.averageCallDurationCurrentPeriod)
                        )
                      : 0,
                  icon: "clock",
                  value: isLoading
                    ? "..."
                    : data && data.averageCallDurationCurrentPeriod !== null
                    ? data.averageCallDurationCurrentPeriod
                    : "0",
                },
              ]}
            />
          </Grid.Col>

          <Grid.Col xs={12}>
            <Card withBorder shadow="md" py="md">
              <Title order={3} mb="md">
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
