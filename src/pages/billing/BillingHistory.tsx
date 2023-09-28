import {
    Grid,
    Card,
    Title
} from "@mantine/core";

function BillingHistory() {
    return (
        <Grid>
          <Grid.Col>
            <Card withBorder py="md">
              <Title order={3}>
                Billing History
              </Title>
            </Card>
          </Grid.Col>
        </Grid>
    )
}
export default BillingHistory;