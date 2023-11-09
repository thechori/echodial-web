import { Box, Button, Center, Loader, Progress, Text } from "@mantine/core";
//
import { useGetTrialCreditsQuery } from "../../services/trial-credit";
import { useGetSubscriptionStatusQuery } from "../../services/stripe";
import { useAppDispatch } from "../../store/hooks";
import { setSubscriptionActive } from "../../store/user/slice";
import { useMemo } from "react";
import { notifications } from "@mantine/notifications";

/**
 *
 * The footer should:
 *
 * [x] Initialize with TrialCredits (since a new user has no proper subscription)
 * [x] Notify the user is almost out of TrialCredits - advise they upgrade to avoid any service disruptions
 * [ ] Notify the user is out of TrialCredits - advise they must upgrade to gain access to dialer again
 * [ ] Display the subscription tier they are currently signed up for
 * [ ] Allow clicking sub tier to take them to page to change sub
 *
 * States:
 *
 * - Account with trial and no sub (good - most common, but shortest)
 * - Account with expired trial and no sub (bad - 2nd most common [i'd imagine])
 * - Account with trial and sub (good good - least common IMO)
 * - Accounts with expired trial and sub (good - most common)
 *
 * Logic:
 *
 * 1. check for subscription, this is the most important thing - no need to show trial details
 * 1. display subscription if found
 * 1. check for
 */
export const SidebarSubscriptionDetail = () => {
  const dispatch = useAppDispatch();
  const { data: trialCredits, isLoading: isTrialCreditsLoading } =
    useGetTrialCreditsQuery();
  const { data: subscriptionStatus, isLoading: isSubscriptionStatusLoading } =
    useGetSubscriptionStatusQuery();

  const text = useMemo(() => {
    let text = "";

    if (!trialCredits && !subscriptionStatus) {
      // No trial or subscription found
      text = "Error fetching subscription details";
    } else if (subscriptionStatus && subscriptionStatus.status === "active") {
      // Subscription active
      text = subscriptionStatus.description || "Subscription active";
      dispatch(setSubscriptionActive(true));
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
        text = "0 credits left";
      } else {
        text = `${trialCredits.remaining_amount} of ${trialCredits.initial_amount} credits left`;
        dispatch(setSubscriptionActive(true));
      }
    } else {
      // Error
      text = "Error fetching subscription details";
    }

    return text;
  }, [subscriptionStatus, trialCredits]);

  const getPercent = useMemo(() => {
    let percent = 100;

    // Handle valid subscription
    if (subscriptionStatus && subscriptionStatus.status === "active") {
      // TODO: fix this
      // Hard code at 100 for now
      percent = 100;
    } else if (trialCredits) {
      // Percentage = remaining / total * 100
      // Handle 0 or negative scenario first
      if (trialCredits.remaining_amount <= 0) {
        percent = 0;
      } else {
        percent =
          (trialCredits.remaining_amount / trialCredits.initial_amount) * 100;
      }
    }

    // Less than 25% - show a notification warning
    if (percent < 25) {
      notifications.show({
        autoClose: false,
        message:
          "You've got less than 25% credits left for the month. Consider upgrading your account to avoid service disruption!",
      });
    }

    return percent;
  }, [subscriptionStatus, trialCredits]);

  return (
    <Box className="trial-details" p="lg" bg="black">
      <Text
        size="xs"
        ta="center"
        weight={500}
        mb="xs"
        color={getPercent === 0 ? "red" : ""}
      >
        {isTrialCreditsLoading || isSubscriptionStatusLoading ? (
          <Loader size="sm" />
        ) : (
          text
        )}
      </Text>
      <Progress mb="md" value={getPercent} />
      <Center>
        {/* TODO: Don't show button if user has unlimited plan */}
        <Button size="xs" compact variant="gradient">
          Upgrade
        </Button>
      </Center>
    </Box>
  );
};
