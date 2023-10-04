import { Grid, Card, Title, Button, Flex } from "@mantine/core";

function PaymentMethods() {
  return (
    <Grid py="sm">
      <Grid.Col>
        <Card withBorder py="md">
          <Title order={3}>Payment Methods</Title>
          <p>Default</p>

          <Flex justify="center" align="center" mb="sm">
            <Button variant="outline" color="gray" fullWidth>
              Payment Method
            </Button>
          </Flex>

          <p>Other</p>
          <Flex justify="center" align="center" mb="sm">
            <Button variant="outline" fullWidth>
              Add a payment method
            </Button>
          </Flex>
        </Card>
      </Grid.Col>
    </Grid>
  );
}
export default PaymentMethods;
