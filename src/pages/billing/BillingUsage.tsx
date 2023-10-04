import { Grid, Card, Flex, Title, Table, Select, Button } from "@mantine/core";
import { useAppSelector } from "../../store/hooks";
function BillingUsage() {
  const billing = useAppSelector((state) => state.billing);
  var currentBalance = billing.currentBalance;
  var roundedBalance = currentBalance.toFixed(4);
  return (
    <Grid py="sm">
      <Grid.Col xs={12} md={6}>
        <Card withBorder py="md" h="100%">
          <Title order={3} mb="sm">
            Billing Information
          </Title>
          <p>Current Balance</p>
          <p>${roundedBalance}</p>
          <Button variant="light" radius="xs">
            Add Funds
          </Button>
          <p>Invoice</p>
        </Card>
      </Grid.Col>

      <Grid.Col xs={12} md={6}>
        <Card withBorder py="md" h="100%">
          <Flex justify="space-between" align="center" mb="sm">
            <Title order={3}>Usage Summary</Title>

            <Select
              placeholder="Month"
              data={["January", "February"]}
              px="xs"
            />
          </Flex>

          <Table highlightOnHover>
            <thead>
              <tr>
                <th>Product</th>
                <th>Costs</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Total Costs</td>
                <td>0</td>
              </tr>
              <tr>
                <td>Sales Tax</td>
                <td>0</td>
              </tr>
              <tr>
                <td>Programmable Voice</td>
                <td>0</td>
              </tr>
              <tr>
                <td>Phone Numbers</td>
                <td>0</td>
              </tr>
            </tbody>
          </Table>
        </Card>
      </Grid.Col>
    </Grid>
  );
}
export default BillingUsage;
