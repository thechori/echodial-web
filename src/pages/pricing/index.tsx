import { Button, Container, Space, Text, Title } from "@mantine/core";
import routes from "../../configs/routes";
import PricingStyled from "./Pricing.styles";
import { Link } from "react-router-dom";

function Pricing() {
  return (
    <PricingStyled>
      <Container py="xl">
        <Title>Pricing</Title>
        <Text size="xl" my="lg">
          $100/mo
        </Text>
        <Space h="2rem" />
        <Link to={routes.signUp}>
          <Button variant="gradient" size="xl">
            Try L34ds free
          </Button>
        </Link>
      </Container>
    </PricingStyled>
  );
}

export default Pricing;
