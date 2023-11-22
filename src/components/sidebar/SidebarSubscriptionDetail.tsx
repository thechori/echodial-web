import { Box, Button, Center, Loader, Progress, Text } from "@mantine/core";
//
import { useGetTrialCreditsQuery } from "../../services/trial-credit";
import { useGetSubscriptionStatusQuery } from "../../services/stripe";
import { useAppDispatch } from "../../store/hooks";
import { setSubscriptionActive } from "../../store/user/slice";
import { useEffect, useMemo, useState } from "react";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import routes from "../../configs/routes";
import { extractErrorMessage } from "../../utils/error";
import apiService from "../../services/api";

/**
 *
 * The footer should:
 *
 * [x] Initialize with TrialCredits (since a new user has no proper subscription)
 * [x] Notify the user is almost out of TrialCredits - advise they upgrade to avoid any service disruptions
 * [x] Notify the user is out of TrialCredits - advise they must upgrade to gain access to dialer again
 * [x] Display the subscription tier they are currently signed up for
 * [x] Allow clicking sub tier to take them to page to change sub
 *
 * States:
 *
 * - Account with no trial (legacy + post subscription)
 * - Account with trial and no sub (good - most common, but shortest)
 * - Account with expired trial and no sub (bad - 2nd most common [i'd imagine])
 * - Account with trial and sub (good good - least common IMO)
 * - Accounts with expired trial and sub (good - most common)
 *
 */
export const SidebarSubscriptionDetail = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [stripeCustomerPortalLinkError, setStripeCustomerPortalLinkError] =
    useState("");
  const [stripeCustomerPortalLinkLoading, setStripeCustomerPortalLinkLoading] =
    useState(false);
  const { data: trialCredits, isLoading: isTrialCreditsLoading } =
    useGetTrialCreditsQuery();
  const { data: subscriptionStatus, isLoading: isSubscriptionStatusLoading } =
    useGetSubscriptionStatusQuery();

  const handleUpgradeSubscription = () => {
    navigate(routes.subscription);
  };

  async function handleManageSubscription() {
    // If user has no subscription, take them to the /subscription page to enroll in a NEW subscription
    if (!subscriptionStatus) {
      navigate(routes.subscription);
      return;
    }

    // If user has an existing subscription, generate a short-life link via Stripe to the Customer Portal
    try {
      setStripeCustomerPortalLinkError("");
      setStripeCustomerPortalLinkLoading(true);

      const res = await apiService.post(
        "/stripe/create-customer-portal-session"
      );

      // API call to generate short-lived URL
      const { url } = res.data;

      // Redirect
      window.location.replace(url);
    } catch (e) {
      setStripeCustomerPortalLinkError(extractErrorMessage(e));
    } finally {
      setStripeCustomerPortalLinkLoading(false);
    }
  }

  const text = useMemo(() => {
    let text = "";

    if (!trialCredits && !subscriptionStatus) {
      // No trial or subscription found
      text = "No trial or subscription found";
    } else if (
      subscriptionStatus &&
      subscriptionStatus.subscription.status === "active"
    ) {
      // Subscription active
      text = subscriptionStatus.product.name;
    } else if (
      subscriptionStatus &&
      trialCredits &&
      trialCredits.remaining_amount <= 0
    ) {
      // Subscription not active (and trial credits depleted)
      text = "Subscription not active";
    } else if (trialCredits) {
      // Trial found
      // Handle 0 or negative scenario first
      // Percentage = remaining / total * 100
      if (trialCredits.remaining_amount <= 0) {
        text = "0 trial credits left";
      } else {
        text = `${trialCredits.remaining_amount} trial credits left`;
      }
    } else {
      // Error
      text = "Error fetching subscription details";
    }

    return text;
  }, [subscriptionStatus, trialCredits]);

  // Determine if subscription is active and upload global state
  useEffect(() => {
    if (!trialCredits && !subscriptionStatus) {
      // No trial or subscription found
      dispatch(setSubscriptionActive(false));
    } else if (
      subscriptionStatus &&
      subscriptionStatus.subscription.status === "active"
    ) {
      // Subscription active
      dispatch(setSubscriptionActive(true));
    } else if (
      subscriptionStatus &&
      trialCredits &&
      trialCredits.remaining_amount <= 0
    ) {
      // Subscription not active (and trial credits depleted)
      dispatch(setSubscriptionActive(false));
    } else if (trialCredits) {
      // Trial found
      // Handle 0 or negative scenario first
      // Percentage = remaining / total * 100
      if (trialCredits.remaining_amount <= 0) {
        dispatch(setSubscriptionActive(false));
      } else {
        dispatch(setSubscriptionActive(true));
      }
    } else {
      // Error
      dispatch(setSubscriptionActive(false));
    }
  }, [trialCredits, subscriptionStatus]);

  // [x] Valid trial + no sub
  // [x] Expired trial + no sub
  // [ ] Sub with credits
  // [ ] Expired sub
  const percent = useMemo(() => {
    let _percent = 100;

    if (isSubscriptionStatusLoading) {
      return _percent;
    }

    if (!trialCredits && !subscriptionStatus) {
      _percent = -1;
    }

    // Handle valid subscription
    if (
      subscriptionStatus &&
      subscriptionStatus.subscription.status === "active"
    ) {
      // TODO: fix this
      // Hard code at 100 for now
      _percent = 100;
    } else if (trialCredits) {
      // Percentage = remaining / total * 100
      // Handle 0 or negative scenario first
      if (trialCredits.remaining_amount <= 0) {
        _percent = 0;
      } else {
        _percent =
          (trialCredits.remaining_amount / trialCredits.initial_amount) * 100;
      }
    }

    return _percent;
  }, [subscriptionStatus, trialCredits, isSubscriptionStatusLoading]);

  // [x] Active sub (show nothing)
  // [x] Low trials credits + no subscription (show warning)
  // [x] Empty trials credits + no subscription (show error)
  useEffect(() => {
    if (percent === 0) {
      notifications.show({
        color: "red",
        autoClose: false,
        message:
          "You are out of trial credits and no subscription is active. Upgrade your account to enable the dialer 👍",
      });
    } else if (percent < 25) {
      notifications.show({
        message:
          "You're running low on credits. Upgrade your account to avoid service disruption 👍",
      });
    }
  }, [percent, subscriptionStatus]);

  return (
    <Box className="trial-details" p="lg" bg="black">
      <Text
        size="xs"
        ta="center"
        weight={500}
        mb="xs"
        color={percent === 0 ? "red" : ""}
      >
        {isTrialCreditsLoading || isSubscriptionStatusLoading ? (
          <Loader size="sm" />
        ) : (
          text
        )}
      </Text>
      <Progress
        mb="md"
        value={percent}
        color={percent === 0 ? "red" : percent < 25 ? "yellow" : ""}
      />

      {/* [x] Show "Upgrade" if user has no active account */}
      {/* [x] Show "Manage" if user has active account */}
      {/* [x] Don't show button if user has unlimited plan */}
      <Center>
        {!subscriptionStatus ? (
          <Button
            size="xs"
            compact
            variant="gradient"
            onClick={handleUpgradeSubscription}
          >
            Upgrade
          </Button>
        ) : subscriptionStatus.product.name !== "Unlimited plan" ? (
          <Button
            size="xs"
            compact
            variant="gradient"
            onClick={handleManageSubscription}
            loading={stripeCustomerPortalLinkLoading}
          >
            Manage
          </Button>
        ) : null}
        <Text color="red">{stripeCustomerPortalLinkError}</Text>
      </Center>
    </Box>
  );
};
