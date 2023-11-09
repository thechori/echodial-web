import { Box, Button, Center, Loader, Progress, Text } from "@mantine/core";
//
import { useGetTrialCreditsQuery } from "../../services/trial-credit";
import { useGetSubscriptionStatusQuery } from "../../services/stripe";

/**
 *
 * The footer should:
 *
 * [x] Initialize with TrialCredits (since a new user has no proper subscription)
 * [ ] Notify the user is almost out of TrialCredits - advise they upgrade to avoid any service disruptions
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
  const { data: trialCredits, isLoading: isTrialCreditsLoading } =
    useGetTrialCreditsQuery();
  const {
    data: subscriptionStatus /*isLoading: isSubscriptionStatusLoading*/,
  } = useGetSubscriptionStatusQuery();

  const getText = () => {
    let text = "";

    console.log("subscriptionStatus", subscriptionStatus);
    console.log("trialCredits", trialCredits);

    if (!trialCredits && !subscriptionStatus) {
      // No trial or subscription found
      text = "Error fetching subscription details";
    } else if (subscriptionStatus && subscriptionStatus.status === "active") {
      // Subscription found
      text = subscriptionStatus.description || "Subscription active";
    } else if (subscriptionStatus) {
      // Subscription not active
      text = "Subscription not active";
    } else if (trialCredits) {
      // Trial found
      // Handle 0 or negative scenario first
      // Percentage = remaining / total * 100
      if (trialCredits.remaining_amount <= 0) {
        text = "0 credits left";
      } else {
        text = `${trialCredits.remaining_amount} of ${trialCredits.initial_amount} credits left`;
      }
    } else {
      // Error
      text = "Error fetching subscription details";
    }

    return text;
  };

  const getPercent = () => {
    let percent = 100;

    //   // Percentage = remaining / total * 100
    //   // Handle 0 or negative scenario first
    //   if (trialCredits.remaining_amount <= 0) {
    //     percent = 0;
    //   } else {
    //     percent =
    //       (trialCredits.remaining_amount / trialCredits.initial_amount) * 100;
    //   }

    return percent;
  };

  return (
    <Box className="trial-details" p="lg" bg="black">
      <Text
        size="xs"
        ta="center"
        weight={500}
        mb="xs"
        color={getPercent() === 0 ? "red" : ""}
      >
        {isTrialCreditsLoading ? <Loader size="sm" /> : getText()}
      </Text>
      <Progress mb="md" value={getPercent()} />
      <Center>
        <Button size="xs" compact variant="gradient">
          Upgrade
        </Button>
      </Center>
    </Box>
  );
};
