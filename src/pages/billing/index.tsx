import {
  Anchor,
  Box,
  Card,
  Container,
  Grid,
  List,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconCircleCheck } from "@tabler/icons-react";

function Billing() {
  return (
    <Container fluid p="md">
      <Grid>
        <Grid.Col xs={12} sm={12} md={6}>
          <Card withBorder shadow="md">
            <Title order={3}>Support</Title>
            <Box py="md">
              <Text>
                Need help with something? Contact our support team and one of
                our agents should have a response for you within 24 hours.
              </Text>
              <List
                spacing="xs"
                size="sm"
                p="md"
                center
                icon={
                  <ThemeIcon color="teal" size={24} radius="xl">
                    <IconCircleCheck size="1rem" />
                  </ThemeIcon>
                }
              >
                <List.Item>
                  <Anchor href="mailto:support@echodial.com">
                    support@echodial.com
                  </Anchor>
                </List.Item>
                {/* Note: hiding phone for now until this is ready to be fully supported */}
                {/* <List.Item>
                <Anchor mr="sm" href={`tel:${phoneNumberSupport}`}>
                  {phoneFormatter(phoneNumberSupport)}
                </Anchor>
                (Monday-Friday 8:00am CST - 5:00pm CST)
              </List.Item> */}
              </List>
            </Box>
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
}

export default Billing;
