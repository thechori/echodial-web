import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { PiPhone } from "react-icons/pi";
import { useDisclosure } from "@mantine/hooks";
import {
  Accordion,
  Box,
  Button,
  Card,
  Container,
  Flex,
  Grid,
  Progress,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
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
import { APP_NAME } from "../../configs/labels";
import { setShowOptions } from "../../store/dialer/slice";
import { PhoneInput } from "../../components/phone-input";
import DeleteAccountModal from "./DeleteAccountConfirmationModal";
import { extractErrorMessage } from "../../utils/error";
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
    if (!subscription) {
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
              <Title order={3}>Profile</Title>
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

        {subscription && (
          <Grid.Col xs={12} sm={6}>
            <Card withBorder py="md" h="100%">
              <Title order={3}>{subscription.product.name} usage</Title>
              <Flex align="center" justify="space-between" py="sm">
                <Text c="dimmed">{subscription?.product.description}</Text>
                {/* <Text c="dimmed">
                  {1200} min used of {9999} min
                </Text> */}
              </Flex>

              <Progress radius="xs" size="lg" value={100} />

              {/* <Text c="dimmed" py="sm">
                Last month you used {1200} minutes
              </Text> */}

              <Accordion variant="filled" radius="xs" chevronPosition="left">
                <Accordion.Item key={1} value={"hello"}>
                  <Accordion.Control>
                    <Text c="dimmed">How does this work?</Text>
                  </Accordion.Control>
                  <Accordion.Panel>
                    Every month, your account balance is refreshed with the
                    number of minutes included in your plan. See our FAQ on the
                    home page for more details.
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            </Card>
          </Grid.Col>
        )}

        <Grid.Col xs={12} sm={6}>
          <Card withBorder shadow="md">
            <Title order={3}>Manage subscription</Title>

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
