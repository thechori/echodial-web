import { Button, Container, Space, Title } from "@mantine/core";
import routes from "../../configs/routes";
import PricingStyled from "./Pricing.styles";
import { Link } from "react-router-dom";

function Pricing() {
  return (
    <PricingStyled>
      <Container py="xl">
        <Title order={1} weight={200} mb="md">
          Pricing
        </Title>
        <Title order={3} weight={300} my="lg">
          $70 per month
        </Title>
        <Space h="2rem" />
        <Link to={routes.signUp}>
          <Button variant="gradient" size="xl">
            Try for free
          </Button>
        </Link>
      </Container>
    </PricingStyled>
  );
}

export default Pricing;
