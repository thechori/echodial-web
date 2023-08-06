import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Button,
  Card,
  Container,
  Grid,
  Group,
  Space,
  TextInput,
  Title,
} from "@mantine/core";
import SubscriptionItem from "./SubscriptionItem";
import { basic, pro } from "./settings-data";

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
      <Container py="sm">
        <Grid>
          <Grid.Col xs={12} sm={6}>
            <Card withBorder shadow="md" m="sm">
              <Title order={2}>Account</Title>
              <Group spacing="sm">
                <TextInput miw={300} label="First name" value={firstName} />
                <TextInput miw={300} label="Last name" value={lastName} />
                <TextInput miw={300} label="Phone number" value={phone} />

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
              <Title order={2}>Security</Title>
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
          <Title order={2} mb="sm">
            Subscription
          </Title>

          <Grid>
            <Grid.Col xs={6} sm={6}>
              <SubscriptionItem
                data={basic}
                selected={plan === "basic"}
                onSelect={() => setPlan("basic")}
              />
            </Grid.Col>

            <Grid.Col xs={6} sm={6}>
              <SubscriptionItem
                data={pro}
                selected={plan === "pro"}
                onSelect={() => setPlan("pro")}
              />
            </Grid.Col>
          </Grid>

          <Button size="lg" variant="gradient" disabled>
            Update
          </Button>
        </Card>

        <Card withBorder shadow="md" color="red">
          <Title order={2} mb="sm">
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
