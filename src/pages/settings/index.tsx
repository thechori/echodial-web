import { useNavigate } from "react-router-dom";
//
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectEmail, signOut } from "../../store/user/slice";
import routes from "../../configs/routes";
import SettingsStyled from "./Settings.styles";
import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  TextInput,
  Title,
} from "@mantine/core";
import SubscriptionItem from "./SubscriptionItem";
import { useState } from "react";
import { basic, pro } from "./settings-data";

function Settings() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [plan, setPlan] = useState<"pro" | "basic">("pro");

  const email = useAppSelector(selectEmail);

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
              <Box>
                <form>
                  <TextInput label="Email" readOnly value={email} />
                  <TextInput label="Password" />
                  <Button>Update</Button>
                </form>

                <Button color="red" onClick={handleSignOut}>
                  Sign out
                </Button>
              </Box>
            </Card>
          </Grid.Col>
        </Grid>

        <Card withBorder shadow="md" m="sm">
          <Title order={2} mb="sm">
            Subscription
          </Title>

          <Grid>
            <Grid.Col xs={12} sm={6} md={4}>
              <SubscriptionItem
                data={basic}
                selected={plan === "basic"}
                onSelect={() => setPlan("basic")}
              />
            </Grid.Col>

            <Grid.Col xs={12} sm={6} md={4}>
              <SubscriptionItem
                data={pro}
                selected={plan === "pro"}
                onSelect={() => setPlan("pro")}
              />
            </Grid.Col>
          </Grid>

          <Button>Save</Button>
        </Card>
      </Container>
    </SettingsStyled>
  );
}

export default Settings;
