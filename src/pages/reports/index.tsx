import ReportsStyled from "./Reports.styles";
import { Box, Card, Container, Grid, Title } from "@mantine/core";
import SimpleAreaChart from "../../components/charts/simple-area";

function Reports() {
  return (
    <ReportsStyled>
      <Container>
        <h1>Reports</h1>

        <Grid>
          <Grid.Col xs={12} sm={6} lg={4}>
            <Card>
              <Title order={2} mb={16}>
                Balance History
              </Title>
              <Box h={300} w={400}>
                <SimpleAreaChart />
              </Box>
            </Card>
          </Grid.Col>

          <Grid.Col xs={12} sm={6} lg={4}>
            <Card>
              <Title order={2} mb={16}>
                Usage History
              </Title>

              <Box h={300} w={400}>
                <SimpleAreaChart />
              </Box>
            </Card>
          </Grid.Col>
        </Grid>
      </Container>
    </ReportsStyled>
  );
}

export default Reports;
