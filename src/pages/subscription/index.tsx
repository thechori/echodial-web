import { useNavigate } from "react-router-dom";
import { Box, Button, Center, Container, Text, Title } from "@mantine/core";
//
import StripePricingTable from "../pricing/StripePricingTable";
import { useAppSelector } from "../../store/hooks";
import { useGetSubscriptionStatusQuery } from "../../services/stripe";
import routes from "../../configs/routes";

const SubscriptionPage = () => {
  const navigate = useNavigate();
  const { jwtDecoded } = useAppSelector((state) => state.user);
  const { data: subscription } = useGetSubscriptionStatusQuery();

  const handleBack = () => {
    navigate(-1);
  };

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
  if (subscription) {
    navigate(routes.settings);
  }

  return (
    <Container fluid p={0} mt="xl">
      <Title ta="center" order={1} weight={300}>
        Subscription
      </Title>

      <Box mx="auto" py="lg" maw={500}>
        <Text ta="center" py={4}>
          All plans include full access to our platform.
        </Text>
        <Text ta="center" py={4}>
          Avoid the headaches of constantly having to top-off your account
          balances with our straightforward price structures.
        </Text>
      </Box>

      <Box py="md">
        <StripePricingTable
          customerEmail={jwtDecoded.email}
          userId={jwtDecoded.id}
        />
      </Box>

      <Center mt="xl">
        <Button onClick={handleBack} variant="subtle">
          Back
        </Button>
      </Center>
    </Container>
  );
};

export default SubscriptionPage;
