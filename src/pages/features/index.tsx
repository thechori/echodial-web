import { Button, Space } from "@mantine/core";
import routes from "../../configs/routes";
import FeaturesStyled from "./Features.styles";
import { Link } from "react-router-dom";

function Features() {
  return (
    <FeaturesStyled>
      <div className="container">
        <h1>Features</h1>
        <p>Our app rox the sox. Get with it!</p>
        <h2>FULL MOBILE SUPPORT</h2>
        <h2>AUTO DIAL</h2>
        <Space h="2rem" />
        <Link to={routes.tryL34ds}>
          <Button size="xl">Try L34ds free</Button>
        </Link>
      </div>
    </FeaturesStyled>
  );
}

export default Features;
