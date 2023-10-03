import {
  Card,
  Grid,
  Progress,
  Flex,
  Accordion,
  Title,
  Text,
} from "@mantine/core";
import { useAppSelector } from "../../store/hooks";
import { BillingSlice } from "../../store/billing/slice";

function PlanUsage() {
  const billing = useAppSelector(BillingSlice.getInitialState);

  const currentUsage = billing.currentMinutes;
  const maxUsage = billing.maxLimit;
  const progressPercentage = (currentUsage / maxUsage) * 100;
  return (
    <Grid py="sm">
      <Grid.Col>
        <Card withBorder py="md" h="100%">
          <Title order={3}>Plan Usage</Title>
          <Flex align="center" justify="space-between" py="sm">
            <Text c="dimmed">
              Your plan includes {maxUsage} minutes of voice calling per month
            </Text>
            <Text c="dimmed">
              {currentUsage} min used of {maxUsage} min
            </Text>
          </Flex>

          <Progress radius="xs" size="lg" value={progressPercentage} />
          <Text c="dimmed" py="sm">
            Last month you used {currentUsage} minutes
          </Text>
          <Accordion variant="filled" radius="xs" chevronPosition="left">
            <Accordion.Item key={1} value={"hello"}>
              <Accordion.Control>
                <Text c="dimmed">How does this work?</Text>
              </Accordion.Control>
              <Accordion.Panel>idk</Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Card>
      </Grid.Col>
    </Grid>
  );
}

export default PlanUsage;
