import BillingStyled from "./Billing.styles";
import { 
  Container,
  Card, 
  Grid, 
  Progress,
  Flex,
  Accordion
} from "@mantine/core";

function Billing() {
  const currentUsage = 450;
  const maxUsage = 1000;
  const progressPercentage = (currentUsage/maxUsage) * 100;

  return (
    <BillingStyled>
      <Container fluid py="lg" px="lg">
        <h1>Billing</h1>
        
        <Grid>
          <Grid.Col>
            <Card withBorder py="md">
              <h3>
                Plan Usage
              </h3>
              <Flex align="center" justify="space-between">
                <p>
                  Your plan includes 1000 minutes of voice calling per month
                </p>
                <p>
                  {currentUsage} min used of {maxUsage} min
                </p>
              </Flex>
              
              <Progress radius="xs" size="lg" value={progressPercentage} />
              <p>
                Last month you used {currentUsage} minutes
              </p>
              <Accordion variant="filled" radius="xs" chevronPosition="left">
                <Accordion.Item key={1} value={"hello"}>
                  <Accordion.Control>How Does this work?</Accordion.Control>
                  <Accordion.Panel>idk</Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            </Card>
          </Grid.Col>

          <Grid.Col span={6}>
            <Card withBorder py="md">
              <h3>
                Billing Information
              </h3>
            </Card>
          </Grid.Col>

          <Grid.Col span={6}>
            <Card withBorder py="md">
              <h3>
                Usage Summary
              </h3>
            </Card>
          </Grid.Col>

          <Grid.Col>
            <Card withBorder py="md">
              <h3>
                Payment Methods
              </h3>
            </Card>
          </Grid.Col>
            
          <Grid.Col>
            <Card withBorder py="md">
              <h3>
                Billing Settings
              </h3>
            </Card>
          </Grid.Col>

          <Grid.Col>
            <Card withBorder py="md">
              <h3>
                Billing History
              </h3>
            </Card>
          </Grid.Col>
          
        </Grid>
      </Container>
    </BillingStyled>
  );
}

export default Billing;
