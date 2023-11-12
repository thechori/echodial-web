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
import { setShowOptions } from "../../store/dialer/slice";
import { PhoneInput } from "../../components/phone-input";
import { PiPhone } from "react-icons/pi";
import { useDisclosure } from "@mantine/hooks";
import DeleteAccountModal from "./DeleteAccountConfirmationModal";
import { extractErrorMessage } from "../../utils/error";
import { useState } from "react";
import apiService from "../../services/api";
import { useGetSubscriptionStatusQuery } from "../../services/stripe";

function Settings() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { data: subscription } = useGetSubscriptionStatusQuery();
  const [stripeError, setStripeError] = useState("");
  const [stripeLoading, setStripeLoading] = useState(false);
  const email = useAppSelector(selectEmail);
  const phone = useAppSelector(selectPhone);
  const firstName = useAppSelector(selectFirstName);
  const lastName = useAppSelector(selectLastName);
  const [opened, { open, close }] = useDisclosure(false);

  function handleSignOut() {
    dispatch(signOut());
    navigate(routes.signIn);
  }

  function openDialerSettingsModal() {
    dispatch(setShowOptions(true));
  }

  function openDeleteConfirmationModal() {
    open();
  }

  async function manageSubscription() {
    // If user has no subscription, take them to the /subscription page to enroll in a NEW subscription
    if (!subscription || subscription.status === null) {
      navigate(routes.subscription);
      return;
    }

    // If user has an existing subscription, generate a short-life link via Stripe to the Customer Portal
    try {
      setStripeError("");
      setStripeLoading(true);

      const res = await apiService.post(
        "/stripe/create-customer-portal-session"
      );

      // API call to generate short-lived URL
      const { url } = res.data;

      // Redirect
      window.location.replace(url);
    } catch (e) {
      setStripeError(extractErrorMessage(e));
    } finally {
      setStripeLoading(false);
    }
  }

  return (
    <Container fluid p="md">
      <Grid>
        <Grid.Col xs={12} sm={6}>
          <Card withBorder shadow="md" mb="md">
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
              <Box mt="sm">
                <PhoneInput
                  label="Phone number"
                  value={phone || ""}
                  onChange={() =>
                    console.log(
                      "log function included to satisfy required prop"
                    )
                  }
                  disabled
                  readOnly
                />
              </Box>
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
          <Card withBorder shadow="md" mb="md">
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

        <Grid.Col xs={12} sm={6}>
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

        <Grid.Col xs={12} sm={6}>
          <Card withBorder shadow="md">
            <Title order={3}>Dialer</Title>
            <Box>
              <Text py="md">
                Configure your call settings to maximize productivity in your
                unique situation.
              </Text>
              <Button
                variant="outline"
                onClick={openDialerSettingsModal}
                leftIcon={<PiPhone fontSize="1rem" />}
              >
                Open dialer settings
              </Button>
            </Box>
          </Card>
        </Grid.Col>

        <Grid.Col xs={12} sm={6}>
          <Card withBorder shadow="md">
            <Title order={3}>Subscription</Title>

            <Box py="md">
              <Text>
                Need to make changes to your account? Click the button below to
                manage your subscription.
              </Text>
            </Box>

            <Flex align="center" justify="space-between">
              <Button
                loading={stripeLoading}
                variant="outline"
                onClick={manageSubscription}
              >
                Manage subscription
              </Button>
              <Text color="red" size="sm">
                {stripeError}
              </Text>
            </Flex>
          </Card>
        </Grid.Col>

        <Grid.Col xs={12} sm={6}>
          <Card withBorder shadow="md" color="red">
            <Title order={3}>Danger zone</Title>
            <Text py="md">
              Not happy with {APP_NAME} any more? Feel free to cancel at any
              time.
            </Text>
            <Button color="red" onClick={openDeleteConfirmationModal}>
              Delete account
            </Button>
          </Card>
        </Grid.Col>
      </Grid>
      <DeleteAccountModal opened={opened} close={close} />
    </Container>
  );
}

export default Settings;
