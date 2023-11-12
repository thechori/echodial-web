import { Box, Title } from "@mantine/core";
import StripePricingTable from "../pricing/StripePricingTable";
import { useAppSelector } from "../../store/hooks";

const SubscriptionPage = () => {
  const { jwtDecoded } = useAppSelector((state) => state.user);

  console.log(jwtDecoded);

  if (!jwtDecoded) {
    return (
      <Box>
        <div>No Customer found</div>
        <div>Contact support: support@echodial.com</div>
      </Box>
    );
  }

  // Only show this page if no subscription is found
  // If found, redirect them to the stripe customer portal

  return (
    <div>
      <Title>Subscription</Title>
      <StripePricingTable
        customerEmail={jwtDecoded.email}
        userId={jwtDecoded.id}
      />
    </div>
  );
};

export default SubscriptionPage;
