import { Box, Container, Text, Title } from "@mantine/core";
//
import PricingStyled from "./Pricing.styles";
import StripePricingTable from "./StripePricingTable";

function Pricing() {
  return (
    <PricingStyled>
      <Container fluid p={0}>
        <Title order={1} weight={300}>
          Pricing
        </Title>

        <Box mx="auto" py="md" maw={500}>
          <Text py={4}>All plans include full access to our platform.</Text>
          <Text py={4}>
            Avoid the headaches of constantly having to top-off your account
            balances with our straightforward price structures.
          </Text>
        </Box>

        <Box py="md">
          <StripePricingTable />
        </Box>
      </Container>
    </PricingStyled>
  );
}

export default Pricing;
