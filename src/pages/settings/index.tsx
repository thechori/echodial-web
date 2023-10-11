import { useNavigate } from "react-router-dom";
import { IconCircleCheck } from "@tabler/icons-react";
import { AiOutlineQuestionCircle } from "react-icons/ai";
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
  List,
  Text,
  TextInput,
  ThemeIcon,
  Title,
  Tooltip,
} from "@mantine/core";
//
import { APP_NAME } from "../../configs/constants";

function Settings() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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
      <Container fluid py="md">
        <Grid>
          <Grid.Col xs={12} sm={6}>
            <Card withBorder shadow="md" m="sm">
              <Flex align="center" justify="space-between">
                <Title order={3}>Account</Title>
                <Tooltip
                  className="hoverable"
                  label="This feature is currently under construction. Check back for an update soon!"
                >
                  <div>
                    <AiOutlineQuestionCircle color="red" fontSize="1.4rem" />
                  </div>
                </Tooltip>
              </Flex>
              <Box>
                <TextInput
                  mt="sm"
                  label="First name"
                  value={firstName}
                  readOnly
                  disabled
                />
                <TextInput
                  mt="sm"
                  label="Last name"
                  value={lastName}
                  readOnly
                  disabled
                />
                <TextInput
                  mt="sm"
                  label="Phone number"
                  value={phone || undefined}
                  readOnly
                  disabled
                />
              </Box>
              <Flex mt="md" align="center" justify="space-between">
                <Button disabled>Update</Button>
                <Button color="red" onClick={handleSignOut}>
                  Sign out
                </Button>
              </Flex>
            </Card>
          </Grid.Col>
          <Grid.Col xs={12} sm={6}>
            <Card withBorder shadow="md" m="sm">
              <Flex align="center" justify="space-between">
                <Title order={3}>Security</Title>
                <Tooltip
                  className="hoverable"
                  label="This feature is currently under construction. Check back for an update soon!"
                >
                  <div>
                    <AiOutlineQuestionCircle color="red" fontSize="1.4rem" />
                  </div>
                </Tooltip>
              </Flex>
              <Box>
                <TextInput
                  mt="sm"
                  label="Email"
                  readOnly
                  value={email}
                  disabled
                />
                <TextInput mt="sm" label="New password" readOnly disabled />
                <TextInput
                  mt="sm"
                  label="Confirm new password"
                  readOnly
                  disabled
                />
              </Box>
              <Box mt="md">
                <Button disabled>Update</Button>
              </Box>
            </Card>
          </Grid.Col>
        </Grid>

        <Card withBorder shadow="md" m="sm">
          <Title order={3}>Support</Title>
          <Box py="md">
            <Text>
              Need help with something? Contact our support team and one of our
              agents should have a response for you within 24 hours.
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

        <Card withBorder shadow="md" m="sm">
          <Title order={3}>Subscription</Title>

          <Box py="md">
            <Text>
              Need to pause your account? Put your account on hold to keep your
              data for 60 days, free of charge.
            </Text>
            <Text italic size="sm">
              Note: You can only do this once per year
            </Text>
          </Box>

          <Flex align="center" justify="space-between">
            <Button
              color="red"
              variant="outline"
              onClick={() => alert("Please email us to complete this step")}
            >
              Pause subscription
            </Button>
          </Flex>
        </Card>

        <Card withBorder shadow="md" color="red" m="sm">
          <Title order={3}>Danger zone</Title>
          <Text py="md">
            Not happy with {APP_NAME} any more? Feel free to cancel at any time.
          </Text>
          <Button
            color="red"
            onClick={() => alert("Please email us to complete this step")}
          >
            Delete account
          </Button>
        </Card>
      </Container>
    </SettingsStyled>
  );
}

export default Settings;
