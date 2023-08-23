import {
  Box,
  Card,
  Container,
  Flex,
  Grid,
  Select,
  Title,
  Tooltip,
} from "@mantine/core";
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
import { BiInfoCircle } from "react-icons/bi";

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
                      ? "LEADS CREATED TODAY"
                      : metricResolution === "week"
                      ? "LEADS CREATED THIS WEEK"
                      : "LEADS CREATED THIS MONTH",
                  diff:
                    data &&
                    data.leadsCreatedCountCurrentPeriod !== null &&
                    data.leadsCreatedCountPreviousPeriod !== null
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
                  title:
                    metricResolution === "day"
                      ? "CALLS MADE TODAY"
                      : metricResolution === "week"
                      ? "CALLS MADE THIS WEEK"
                      : "CALLS MADE THIS MONTH",
                  diff:
                    data &&
                    data.callsMadeCurrentPeriod !== null &&
                    data.callsMadePreviousPeriod !== null
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
                  title:
                    metricResolution === "day"
                      ? "CALLS CONNECTED TODAY"
                      : metricResolution === "week"
                      ? "CALLS CONNECTED THIS WEEK"
                      : "CALLS CONNECTED THIS MONTH",
                  diff:
                    data &&
                    data.callsAnsweredCountCurrentPeriod !== null &&
                    data.callsAnsweredCountPreviousPeriod !== null
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
                  title:
                    metricResolution === "day"
                      ? "AVG. CALL DURATION TODAY"
                      : metricResolution === "week"
                      ? "AVG. CALL DURATION THIS WEEK"
                      : "AVG. CALL DURATION THIS MONTH",
                  diff:
                    data &&
                    data.averageCallDurationInSecondsCurrentPeriod !== null &&
                    data.averageCallDurationInSecondsPreviousPeriod !== null
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
              <Flex align="center" mb="md">
                <Title order={3} mr="xs">
                  Call activity
                </Title>

                <Tooltip label="This is not real data">
                  <Flex align="center">
                    <BiInfoCircle fontSize="1.25rem" />
                  </Flex>
                </Tooltip>
              </Flex>

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
