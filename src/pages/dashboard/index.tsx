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
import secondsFormatter from "../../utils/seconds-formatter";

function Dashboard() {
  const dispatch = useAppDispatch();
  const metricResolution = useAppSelector(selectMetricResolution);
  const { data, isLoading, error } =
    useGetDashboardMetricsQuery(metricResolution);

  console.log("data", data);

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
                    data.leadsCreatedCountCurrentPeriod &&
                    data.leadsCreatedCountPreviousPeriod
                      ? deltaPercentageCalculator(
                          data.leadsCreatedCountPreviousPeriod,
                          data.leadsCreatedCountCurrentPeriod
                        )
                      : 0,
                  icon: "user",
                  value: isLoading
                    ? "..."
                    : data && data.leadsCreatedCountCurrentPeriod !== null
                    ? data.leadsCreatedCountCurrentPeriod.toString()
                    : "0",
                },
                {
                  title: "CALLS MADE",
                  diff:
                    data &&
                    data.callsMadeCurrentPeriod &&
                    data.callsMadePreviousPeriod
                      ? deltaPercentageCalculator(
                          data.callsMadePreviousPeriod.length,
                          data.callsMadeCurrentPeriod.length
                        )
                      : 0,
                  icon: "phone",
                  value: isLoading
                    ? "..."
                    : data && data.callsMadeCurrentPeriod !== null
                    ? data.callsMadeCurrentPeriod.length.toString()
                    : "0",
                },
                {
                  title: "CALLS CONNECTED",
                  diff:
                    data &&
                    data.callsAnsweredCountCurrentPeriod &&
                    data.callsAnsweredCountPreviousPeriod
                      ? deltaPercentageCalculator(
                          data.callsAnsweredCountPreviousPeriod,
                          data.callsAnsweredCountCurrentPeriod
                        )
                      : 0,
                  icon: "coin",
                  value: isLoading
                    ? "..."
                    : data && data.callsAnsweredCountCurrentPeriod !== null
                    ? data.callsAnsweredCountCurrentPeriod.toString()
                    : "0",
                },
                {
                  title: "AVERAGE CALL DURATION",
                  diff:
                    data &&
                    data.averageCallDurationInSecondsCurrentPeriod &&
                    data.averageCallDurationInSecondsPreviousPeriod
                      ? deltaPercentageCalculator(
                          data.averageCallDurationInSecondsPreviousPeriod,
                          data.averageCallDurationInSecondsCurrentPeriod
                        )
                      : 0,
                  icon: "clock",
                  value: isLoading
                    ? "..."
                    : data &&
                      data.averageCallDurationInSecondsCurrentPeriod !== null
                    ? secondsFormatter(
                        data.averageCallDurationInSecondsCurrentPeriod
                      )
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
