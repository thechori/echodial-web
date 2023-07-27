import { Button, Space } from "@mantine/core";
import routes from "../../configs/routes";
import PricingStyled from "./Pricing.styles";
import { Link } from "react-router-dom";

function Pricing() {
  return (
    <PricingStyled>
      <div className="container">
        <h1>Pricing</h1>
        <p>$100/mo</p>
        <Space h="2rem" />
        <Link to={routes.tryL34ds}>
          <Button size="xl">Try L34ds free</Button>
        </Link>
      </div>
    </PricingStyled>
  );
}

export default Pricing;
