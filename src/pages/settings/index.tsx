import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconCircleCheck } from "@tabler/icons-react";
//
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  selectEmail,
  selectFirstName,
  selectLastName,
  selectPhone,
  signOut,
} from "../../store/user/slice";
import routes from "../../configs/routes";
import SettingsStyled from "./Settings.styles";
import {
  Anchor,
  Box,
  Button,
  Card,
  Container,
  Flex,
  Grid,
  Group,
  List,
  Space,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import SubscriptionItem from "./SubscriptionItem";
import { pro } from "./settings-data";
import phoneFormatter from "../../utils/phone-formatter";

const phoneNumberSupport = "+18328638635";

function Settings() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [plan, setPlan] = useState<"pro" | "basic">("pro");

  const email = useAppSelector(selectEmail);
  const phone = useAppSelector(selectPhone);
  const firstName = useAppSelector(selectFirstName);
  const lastName = useAppSelector(selectLastName);

  function handleSignOut() {
    dispatch(signOut());
    navigate(routes.signIn);
  }

  return (
    <SettingsStyled>
      <Container fluid py="lg">
        <Grid>
          <Grid.Col xs={12} sm={6}>
            <Card withBorder shadow="md" m="sm">
              <Title order={3}>Account</Title>
              <Group spacing="sm">
                <TextInput miw={300} label="First name" value={firstName} />
                <TextInput miw={300} label="Last name" value={lastName} />
                <TextInput
                  miw={300}
                  label="Phone number"
                  value={phone || "Error fetching phone number"}
                />

                <Button disabled>Update</Button>
              </Group>
              <Space h="md" />
              <Button color="red" onClick={handleSignOut}>
                Sign out
              </Button>
            </Card>
          </Grid.Col>
          <Grid.Col xs={12} sm={6}>
            <Card withBorder shadow="md" m="sm">
              <Title order={3}>Security</Title>
              <Group>
                <TextInput
                  miw={300}
                  label="Email"
                  readOnly
                  value={email}
                  disabled
                />
                <TextInput miw={300} label="New password" />
                <TextInput miw={300} label="Confirm new password" />
                <Button disabled>Update</Button>
              </Group>
            </Card>
          </Grid.Col>
        </Grid>

        <Card withBorder shadow="md" m="sm">
          <Title order={3} mb="sm">
            Subscription
          </Title>

          <Grid>
            <Grid.Col xs={6} sm={6}>
              <SubscriptionItem
                data={pro}
                selected={plan === "pro"}
                onSelect={() => setPlan("pro")}
              />
            </Grid.Col>
          </Grid>

          <Flex align="center" justify="space-between">
            <Button size="lg" mt="md" variant="gradient" disabled>
              Update
            </Button>
            <Button
              color="red"
              onClick={() => alert("Please email us to complete this step")}
            >
              Cancel subscription
            </Button>
          </Flex>
        </Card>

        <Card withBorder shadow="md" m="sm">
          <Title order={3}>Support</Title>
          <Box p="md">
            <Text>Need help with something? Contact our support team:</Text>
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
                <Anchor href="mailto:support@l34ds.net">
                  support@l34ds.net
                </Anchor>
              </List.Item>
              <List.Item>
                <Anchor mr="sm" href={`tel:${phoneNumberSupport}`}>
                  {phoneFormatter(phoneNumberSupport)}
                </Anchor>
                (Monday-Friday 8:00am CST - 5:00pm CST)
              </List.Item>
            </List>
          </Box>
        </Card>

        <Card withBorder shadow="md" color="red" m="sm">
          <Title order={3} mb="sm">
            Danger zone
          </Title>
          <Space h="md" />
          <Button color="red" onClick={handleSignOut}>
            Delete account
          </Button>
        </Card>
      </Container>
    </SettingsStyled>
  );
}

export default Settings;
