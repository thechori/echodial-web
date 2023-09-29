import { Grid, Card, Title } from "@mantine/core";

function PaymentMethods() {
  return (
    <Grid py="sm">
      <Grid.Col>
        <Card withBorder py="md">
          <Title order={3}>Payment Methods</Title>
          <p>Default</p>
          <p>Other</p>
        </Card>
      </Grid.Col>
    </Grid>
  );
}
export default PaymentMethods;
