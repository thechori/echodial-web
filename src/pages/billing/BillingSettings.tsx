import {
    Grid,
    Card,
    Title
} from '@mantine/core';
function BillingSettings(){
    return (
        <Grid> 
          <Grid.Col>
            <Card withBorder py="md">
              <Title order = {3}>
                Billing Settings
              </Title>
            </Card>
          </Grid.Col>
        </Grid>
    )
}
export default BillingSettings;