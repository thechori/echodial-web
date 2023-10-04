import { Grid, Card, Title } from "@mantine/core";
function BillingSettings() {
  return (
    <Grid py="sm">
      <Grid.Col>
        <Card withBorder py="md">
          <Title order={3}>Billing Settings</Title>
          <p>Address</p>
          <p>Tax Location</p>
          <p>Tax Exemption</p>
        </Card>
      </Grid.Col>
    </Grid>
  );
}
export default BillingSettings;
