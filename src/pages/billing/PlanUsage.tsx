import { Card, Grid, Progress, Flex, Accordion, Title } from "@mantine/core";

function PlanUsage() {
  const currentUsage = 450;
  const maxUsage = 1000;
  const progressPercentage = (currentUsage / maxUsage) * 100;
  return (
    <Grid py="sm">
      <Grid.Col>
        <Card withBorder py="md" h="100%">
          <Title order={3}>Plan Usage</Title>
          <Flex align="center" justify="space-between">
            <p>Your plan includes 1000 minutes of voice calling per month</p>
            <p>
              {currentUsage} min used of {maxUsage} min
            </p>
          </Flex>

          <Progress radius="xs" size="lg" value={progressPercentage} />
          <p>Last month you used {currentUsage} minutes</p>
          <Accordion variant="filled" radius="xs" chevronPosition="left">
            <Accordion.Item key={1} value={"hello"}>
              <Accordion.Control>How does this work?</Accordion.Control>
              <Accordion.Panel>idk</Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Card>
      </Grid.Col>
    </Grid>
  );
}

export default PlanUsage;
